import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../../../../UserContext';
import { format, isToday } from 'date-fns';
import { format as formatTZ } from 'date-fns-tz';
import axios from 'axios';

const Chat = () => {
    const user = useLocalSearchParams();
    const { userId } = useSession();
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        fetchConversation();
        goToEnd("First timeeeeeeeeee");
        markAllMessagesAsViewed();
    }, []);
    useEffect(() => {
        goToEnd("Second timeeeeeeeeee");
    }, [conversation]);

    const flatListRef = useRef<FlatList<{ id: string; text: string }> | null>(null);

    const goToEnd = async (test) => {
        console.log(test);
        try {
            if (flatListRef.current) {
                setTimeout(() => {
                    flatListRef.current.scrollToEnd({ animated: true });
                }, 10);
            }
        } catch (error) {
            console.error('Error going downwards:', error);
        }
    }

    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach((msg) => {
            const date = format(new Date(msg.createdAt), 'yyyy-MM-dd');
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return Object.entries(grouped).map(([date, msgs]) => ({ date, msgs }));
    };

    const renderMessageGroup = ({ item }) => {
        const { date, msgs } = item;
        const formattedDate = isToday(new Date(date)) ? 'Today' : format(new Date(date), 'dd/MM/yyyy');

        return (
            <View>
                <Text style={styles.dateText}>{formattedDate}</Text>
                {msgs.map((msg) => {
                    const createdAtDate = new Date(msg.createdAt);
                    const formattedTime = formatTZ(createdAtDate, 'hh:mm a');
                    const isSentByMe = msg.sender_id === userId.user_id;
                    const messageContainerStyle = {
                        alignSelf: isSentByMe ? 'flex-end' : 'flex-start',
                        backgroundColor: isSentByMe ? '#942AFF' : '#333333',
                    };

                    return (
                        <View key={msg._id} style={{ marginBottom: 10, alignItems: isSentByMe ? 'flex-end' : 'flex-start' }}>
                            <View
                                style={[
                                    styles.messageContainer,
                                    messageContainerStyle,
                                    { maxWidth: `90%` },
                                ]}
                            >
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: isSentByMe ? 'flex-end' : 'flex-start' }}>
                                <Text
                                    style={{
                                        color: '#969697',
                                        fontSize: 8,
                                        textAlign: isSentByMe ? 'right' : 'left',
                                    }}
                                >
                                    {formattedTime}
                                </Text>
                                {isSentByMe && msg.viewed && (
                                    <Ionicons name="checkmark-done" size={12} color="#29BA1A" style={styles.checkmark} />
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    const fetchConversation = async () => {
        try {
            if (!user._id || !userId.user_id) {
                console.log("Both users are not present sender and recipient");
                return;
            }

            const response = await axios.get('http://192.168.31.86:8000/messages/conversation', {
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
                setMessage("Please type first then try to send OKAY!");
                await new Promise(resolve => setTimeout(resolve, 500));
                setMessage("");
                return;
            }

            const response = await axios.post('http://192.168.31.86:8000/messages/send', {
                sender_id: userId.user_id,
                receipent_id: user.user_id,
                text: message
            });
            if (response.status === 201) {
                console.log(`
                    Message sent successfully!
                    From: ${userId.username}
                    To: ${user.username}
                    Message: ${message}
                `);
                setMessage("");
                fetchConversation();
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const markAllMessagesAsViewed = async () => {
        try {
            const response = await axios.get('http://192.168.31.86:8000/messages/seen', {
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
    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={conversation}
                renderItem={renderMessageGroup}
                keyExtractor={(item) => item.date}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    placeholder={`Message ${user.username}`}
                    placeholderTextColor="gray"
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send-sharp" size={35} color="white" />
                </TouchableOpacity>
            </View>
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
    messageText: {
        fontSize: 14,
        color: 'white',
    },
    dateText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#D3D3D3',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
        color: 'white',
        backgroundColor: '#222222',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
    },
    checkmark: {
        marginLeft: 5,
    },
});

export default Chat;
