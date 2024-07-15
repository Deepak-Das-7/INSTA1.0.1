import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import logoDas from '../assets/test.jpg';
import { useSession } from '../UserContext';
import axios from 'axios';



const Friends = ({ item, handlePressProfile, handlePress }) => {
    const { userId } = useSession();
    const [backgroundColor, setBackgroundColor] = useState("blue");
    const [buttonText, setButtonText] = useState("Add Friend");
    const [isPending, setIsPending] = useState(false);
    const [you, setYou] = useState(item);
    const [description, setDescription] = useState("Send the request");
    const [mutualFriends, setMutualFriends] = useState(0);

    useEffect(() => {
        updateButtonStatus();
        calculateMutualFriendCount();
    }, [item, userId])

    const updateButtonStatus = async () => {
        try {
            const response = await axios.get(`http://192.168.31.161:8000/profile/${you.user_id}`);
            const userData = response.data;
            if (userData.request_received.includes(userId.user_id)) {
                setButtonText("Request Sent");
                setBackgroundColor("gray");
                setDescription("Request already sent")

            } else if (userData.request_sent.includes(userId.user_id)) {
                setButtonText("Accept Request");
                setBackgroundColor("red");
                setDescription(`${item.username} sent request`)
            } else if (userData.friends.includes(userId.user_id)) {
                setButtonText("Friends");
                setBackgroundColor("green");
                setDescription("You are friends now!")
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const calculateMutualFriendCount = () => {
        const mutualFriends = you.friends.filter(val =>
            userId.friends.includes(val)
        );
        setMutualFriends(mutualFriends.length);
    };

    const handlePressButton = async () => {
        setIsPending(true);
        try {
            await handlePress({ item, buttonText });
            await updateButtonStatus();
        } catch (error) {
            console.error("Error handling press:", error);
        } finally {
            setIsPending(false);
        }
    };
    const isDisabled = buttonText === "Friends" || buttonText === "Request Sent";
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity style={{ marginRight: 20, justifyContent: "center" }}
                    onPress={() => handlePressProfile(item)}
                >
                    <Image
                        source={item.profilePicture ? { uri: item.profilePicture } : logoDas}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, margin: 10 }}>
                    <View >
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={{ fontSize: 14, color: "gray" }}>{description}</Text>
                        <Text style={{ fontSize: 14, color: "gray" }}>{mutualFriends} mutual friends</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 2 }}>
                        <TouchableOpacity onPress={handlePressButton} style={[styles.button, { backgroundColor }]}
                            disabled={isDisabled}>
                            {isPending ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{buttonText}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        margin: 10
    },
    content: {
        width: "96%",
        backgroundColor: "rgb(15, 15, 10)",
        borderRadius: 10,
        flexDirection: "row",
    },
    username: {
        fontWeight: 'bold',
        color: "white",
        fontSize: 20
    },
    button: {
        flex: 1.5,
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        height: 40
    }
});