import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useSession } from '../../../../../UserContext';
import axios from 'axios';
import MessageInput from '../../../../../components/MessageInput';
import MessageGroup from '../../../../../components/MessageGroup';
import io from 'socket.io-client';
import sanitizeHtml from 'sanitize-html';
import env from '../../../../../config';

const Chat = () => {
    const user = useLocalSearchParams();
    const { userId } = useSession();
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const socket = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socket.current = io(env.API_BASE_URL);

        // Listen for incoming messages
        socket.current.on('receiveMessage', handleReceiveMessage);

        // Fetch existing conversation and mark all messages as viewed
        fetchConversation();
        markAllMessagesAsViewed();

        return () => {
            // Clean up socket connection on component unmount
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        // Scroll to the end when conversation updates
        goToEnd("Conversation updated");
    }, [conversation]);

    const handleReceiveMessage = (newMessage) => {
        if (newMessage.sender_id === user.user_id || newMessage.receipent_id === user.user_id) {
            setConversation((prevConversation) => {
                let messageExists = false;
                const updatedConversation = prevConversation.map((group) => {
                    if (group.msgs.some((msg) => msg._id === newMessage._id)) {
                        messageExists = true;
                        return {
                            ...group,
                            msgs: group.msgs.map((msg) => (msg._id === newMessage._id ? newMessage : msg)),
                        };
                    } else {
                        return group;
                    }
                });

                if (!messageExists) {
                    const latestGroup = updatedConversation[updatedConversation.length - 1];
                    if (latestGroup && latestGroup.date === new Date(newMessage.createdAt).toISOString().split('T')[0]) {
                        latestGroup.msgs.push(newMessage);
                    } else {
                        updatedConversation.push({
                            date: new Date(newMessage.createdAt).toISOString().split('T')[0],
                            msgs: [newMessage],
                        });
                    }
                }

                return groupMessagesByDate(updatedConversation.flat());
            });
            goToEnd("New message received");
        }
    };

    const goToEnd = (message) => {
        console.log(message);
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach((msg) => {
            const date = new Date(msg.createdAt).toISOString().split('T')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return Object.entries(grouped).map(([date, msgs]) => ({ date, msgs }));
    };

    const fetchConversation = async () => {
        try {
            if (!user._id || !userId.user_id) {
                console.log("Both users are not present sender and recipient");
                return;
            }

            const response = await axios.get(`${env.API_BASE_URL}/messages/conversation`, {
                params: {
                    sender_id: userId.user_id,
                    receipent_id: user.user_id,
                }
            });

            if (response.status === 200) {
                const data = response.data;
                setConversation(groupMessagesByDate(data));
                if (data.length === 0) {
                    Alert.alert("New friends!!!!", `Send Hi...to ${user.username}`);
                }
            } else {
                console.error('Failed to fetch conversation');
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const sendMessage = async () => {
        try {
            if (!message) {
                setMessage("Please type first, then try to send.");
                await new Promise(resolve => setTimeout(resolve, 500));
                setMessage("");
                return;
            }

            const createdAt = new Date().toISOString();
            console.log('Sending message with createdAt:', createdAt);

            const newMessage = {
                sender_id: userId.user_id,
                receipent_id: user.user_id,
                text: sanitizeInput(message),
                createdAt: createdAt,
            };

            const response = await axios.post(`${env.API_BASE_URL}/messages/send`, newMessage);
            if (response.status === 201) {
                console.log(`
                Message sent successfully!
                From: ${userId.username}
                To: ${user.username}
                Message: ${message}
            `);
                setMessage("");
                socket.current.emit('sendMessage', newMessage);
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            if (error instanceof RangeError && error.message === 'Date value out of bounds') {
                console.error('Date value out of bounds error:', error);
            } else {
                console.error('Error sending message:', error);
            }
        }
    };

    const markAllMessagesAsViewed = async () => {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/messages/seen`, {
                params: {
                    sender_id: user.user_id,
                    receipent_id: userId.user_id,
                }
            });
            if (response.status === 200) {
                console.log('All messages marked as viewed');
            } else {
                console.error('Failed to mark messages as viewed');
            }
        } catch (error) {
            console.error('Error marking messages as viewed:', error);
        }
    };

    const sanitizeInput = (input) => {
        return sanitizeHtml(input, {
            allowedTags: [],
            allowedAttributes: {},
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={conversation}
                renderItem={({ item }) => <MessageGroup item={item} userId={userId} />}
                keyExtractor={(item, index) => `message-group-${index}`} // Ensure keys are unique
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <MessageInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                username={user.username}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
});

export default Chat;
