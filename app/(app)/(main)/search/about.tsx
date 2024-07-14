import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { useSession } from '../../../../UserContext';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

const chat = () => {
    const { userId, setUserId } = useSession();
    const user = useLocalSearchParams();
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setSelectedUser(user);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {selectedUser ? (
                <>
                    <Text>Emai: {selectedUser.email}</Text>
                    <Text>UserName: {selectedUser.username}</Text>
                    <Text>UserId: {selectedUser._id}</Text>
                    <Text>Password: {selectedUser.password}</Text>
                    <Text>Lastlogin: {selectedUser.lastLogin}</Text>
                </>
            ) : (
                <Text>Loading user data...</Text>
            )}

        </View>
    )
}

export default chat
