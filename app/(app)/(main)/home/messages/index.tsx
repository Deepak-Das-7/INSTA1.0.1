import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Image, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useSession } from '../../../../../UserContext';
import { router } from 'expo-router';

const ChatList = () => {
    const [users, setUsers] = useState([]);
    const { userId } = useSession();

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`http://192.168.31.161:8000/profile/friends/${userId.user_id}`);
            const friendsData = response.data;

            const usersWithLastMessage = await Promise.all(friendsData.map(async (user) => {
                // Fetch user details including profile picture
                const userDetailsResponse = await axios.get(`http://192.168.31.161:8000/profile/${user._id}`);
                const userDetails = userDetailsResponse.data;

                // Fetch last message
                const messageResponse = await axios.get('http://192.168.31.161:8000/messages/conversation', {
                    params: {
                        sender_id: userId.user_id,
                        receipent_id: user._id,
                    }
                });
                const lastMessage = messageResponse.data.slice(-1)[0];

                return { ...userDetails, lastMessage };
            }));

            // Sort users by lastMessage.createdAt in descending order
            const sortedUsers = usersWithLastMessage.sort((a, b) => {
                if (!a.lastMessage || !b.lastMessage) return 0;
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });

            setUsers(sortedUsers);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        fetchFriends();
        const interval = setInterval(() => {
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handlePressMessage = (item) => {
        router.push({
            pathname: "../../../(main)/home/messages/chat",
            params: item
        });
    };

    function formatTime(createdAt) {
        const now = new Date();
        const created = new Date(createdAt);

        const isToday = now.toDateString() === created.toDateString();

        if (isToday) {
            const hours = created.getHours();
            const minutes = created.getMinutes();
            const seconds = created.getSeconds();
            const ampm = hours >= 12 ? 'pm' : 'am';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
        } else {
            const day = created.getDate().toString().padStart(2, '0');
            const month = (created.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
            const year = created.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePressMessage(item)}>
            <View style={styles.chatContainer}>
                <Image
                    source={
                        item.profilePicture
                            ? { uri: item.profilePicture }
                            : require('../../../../../assets/logoDas.png')
                    }
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.message} numberOfLines={1}>
                        {item.lastMessage ? item.lastMessage.text : "No messages yet"}
                    </Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {item.lastMessage ? formatTime(item.lastMessage.createdAt) : ""}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chatContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: "rgb(40, 40, 40)",
        margin: 3,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 3,
    },
    message: {
        color: 'gray',
        fontSize: 14,
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    time: {
        color: '#888888',
        fontSize: 12,
    },
});

export default ChatList;
