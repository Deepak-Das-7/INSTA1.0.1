import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../../../UserContext';
import { format, isToday } from 'date-fns';
import axios from 'axios';
import env from '../../../../config';



const chat = () => {
    const user = useLocalSearchParams();
    const { userId, setUserId } = useSession();
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);

    const renderMessage = ({ item }) => {
        const createdAtDate = new Date(item.createdAt);
        const isMessageToday = isToday(createdAtDate);
        const formattedTimestamp = isMessageToday
            ? format(createdAtDate, 'HH:mm')
            : format(createdAtDate, 'yyyy-MM-dd');
        return (
            <View style={{ marginBottom: 10 }}>
                <View style={{
                    maxWidth: '80%',
                    padding: 10,
                    borderRadius: 10,
                    alignSelf: item.sender_id === userId.user_id ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender_id === userId.user_id ? '#942AFF' : '#333333',
                }}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
                <Text style={{ color: "red", fontSize: 8, textAlign: item.sender_id === userId.user_id ? "right" : "left" }} >{formattedTimestamp}</Text>
            </View>
        );
    };

    useEffect(() => {
        fetchConversation();
    }, []);

    const fetchConversation = async () => {
        try {
            if (!user._id || !userId.user_id) {
                console.log("Both user are not present sender and recipient");
                return;
            }

            const response = await axios.get(`${env.API_BASE_URL}/messages/conversation`, {
                params: {
                    sender_id: userId.user_id,
                    receipent_id: user._id,
                }
            });

            if (response.status === 200) {
                const data = response.data;
                setConversation(data);
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


    const flatListRef = useRef<FlatList<{ id: string; text: string }> | null>(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [conversation]);



    const sendMessage = async () => {
        try {
            if (!message) {
                setMessage("Please type first then try to send OKAY!");
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMessage("");
                return;
            }

            const response = await axios.post(`${env.API_BASE_URL}/messages/send`, {
                sender_id: userId.user_id,
                receipent_id: user._id,
                text: message
            });

            if (response.status === 201) {
                console.log('Message sent successfully!');
                setMessage("");
                fetchConversation();
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={conversation}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id}
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
        color: "white",
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
        backgroundColor: "#222222",
    },
});

export default chat;
