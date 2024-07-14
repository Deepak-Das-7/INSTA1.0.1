import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View, Image, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useSession } from '../../../../UserContext';
import logoDas from '../../../../assets/logoDas.png';

const index = () => {
    const [users, setUsers] = useState([]);
    const { userId, setUserId } = useSession();
    console.log("Userid is ::", userId.username)

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://192.168.31.161:8000/profile/friends/${userId.user_id}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        }
        fetchFriends();
    }, []);



    const handlePressMessage = (item) => {
        // console.log('Pressed chat:', item);
        router.push({
            pathname: "../../(main)/reels/reel",
            params: item
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePressMessage(item)}>
                        <View style={styles.container}>
                            <View style={{ justifyContent: "flex-end", flex: 1.5 }}>
                                <Image
                                    source={item.profilePicture ? { uri: item.profilePicture } : logoDas}
                                    style={styles.avatar}
                                />
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.username}>{item.username}</Text>
                                <Text numberOfLines={1} style={styles.message}>{item.email}</Text>
                            </View>
                            <View style={{ justifyContent: "flex-end", flex: 1.5 }}>
                                <Text style={styles.timestamp}>{item.createdAt.toLocaleString()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        backgroundColor: "rgb(40, 40, 40)",
        margin: 3,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    content: {
        flex: 5,
        justifyContent: "center"
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: "white",
        fontSize: 14
    },
    message: {
        color: 'white',
    },
    timestamp: {
        color: '#888888',
        marginLeft: 10,
        fontSize: 7,
    },
});

export default index;