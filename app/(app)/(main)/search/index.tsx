import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View, Image, StyleSheet, Text, TextInput, Button } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useSession } from '../../../../UserContext';
import logoDas from '../../../../assets/logoDas.png';
import Friends from '../../../../components/Friends';

const index = () => {
    const { userId, setUserId } = useSession();
    const [refreshing, setRefreshing] = useState(false);

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("")

    const getUsers = async () => {
        setRefreshing(true);
        await axios.get(`http://192.168.31.86:8000/profile/allOthers/${userId.user_id}`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                Alert.alert(
                    "Registration Fail",
                    "An error occurred during registration"
                );
                console.log("register failed", error);
            })

        setRefreshing(false);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handlePressProfile = (item) => {
        router.push({
            pathname: "../../(main)/search/about",
            params: item
        });
    };
    const handlePress = async ({ item, buttonText }) => {
        const request = buttonText;
        console.log(request, "request sent to", item.username)

        const response = await fetch(`http://192.168.31.86:8000/request?senderId=${userId.user_id}&receiverId=${item.user_id}&kisme=${request}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error('Failed to accept the request');
            const errorMessage = await response.text();
            console.error('Error:', errorMessage);
        } else {
            console.log('All okay');
        }
    };

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.username.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchText, users]);

    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Search any user..."
                    onChangeText={setSearchText}
                    value={searchText}
                    placeholderTextColor="gray"
                />
            </View>
            {
                filteredUsers.length ? <FlatList
                    data={filteredUsers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Friends
                            item={item}
                            handlePressProfile={handlePressProfile}
                            handlePress={handlePress}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={getUsers}
                /> :
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={styles.message}>No users found</Text>
                    </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        margin: 3,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 25,
        paddingHorizontal: 20,
        color: "white",
        height: 50,
        margin: 10,
        backgroundColor: "#222222"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    content: {
        flex: 4,
        justifyContent: "center",
        backgroundColor: "rgb(40, 40, 40)",
        padding: 10,
        marginHorizontal: 10,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: "white",
        fontSize: 16
    },
    email: {
        color: 'gray',
        fontSize: 10

    },
    timestamp: {
        color: '#888888',
        marginLeft: 10,
        fontSize: 7,
    },
    message: {
        fontSize: 35,
        color: 'red',
        fontWeight: 'bold',
    },
});

export default index;