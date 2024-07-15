import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from '../UserContext';
import { Modal } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native';


const Story = ({ item }) => {

    const { userId } = useSession();
    const [photo, setPhoto] = useState(item.photo);
    const [seeStoryVisible, setSeeStoryVisible] = useState(false);

    const [username, setUsername] = useState("");
    const [userImageUrl, setUserImageUrl] = useState(null);
    const [numberOfLikes, setNumberOfLikes] = useState(0);

    const [seenUsers, setSeenUsers] = useState(item.reacted_user);
    // const [likedUsers, setLikedUsers] = useState(item.liked_user);

    const [modalVisible, setModalVisible] = useState(false);


    const getOwnerDetails = async () => {
        try {
            const response = await axios.get(`http://192.168.31.86:8000/profile/${item.owner_id}`);
            const userData = response.data;
            setUsername(userData.username);
            setUserImageUrl(userData.profilePicture);
        } catch (error) {
            console.error("Error fetching user owner profile:", error);
        }
    };

    const likeCount = async () => {
        try {
            const response = await axios.get(`http://192.168.31.86:8000/story/${item._id}`);
            const userData = response.data;
            console.log(userData);
            await setSeenUsers(userData.reacted_user);
            console.log(seenUsers);
            const data = seenUsers.filter(user => user.liked).length;
            setNumberOfLikes(data);
        } catch (error) {
            console.error("Error fetching like count", error);
        }
    };


    useEffect(() => {
        getOwnerDetails();
        likeCount();
    }, [])


    const toggleSeeStory = async () => {
        await setSeeStoryVisible(!seeStoryVisible);
        await likeCount();
        if (seeStoryVisible) {
            try {
                const response = await axios.post('http://192.168.31.86:8000/story/seen', {
                    story_id: item._id,
                    reactor_id: userId.user_id,
                });
                // console.log('seen successfully:', response.data);
            } catch (error) {
                console.error('Error seeing story:', error);
            }
        }
        await likeCount();
    };

    const liked = async () => {
        try {
            const response = await axios.post('http://192.168.31.86:8000/story/liked', {
                story_id: item._id,
                reactor_id: userId.user_id,
            });
            console.log('liked successfully:', response.data);

            await likeCount();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const timeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.abs(now - time);

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else {
            return `${hours} hours ago`;
        }
    };

    const renderStorySeenUserList = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                backgroundColor: '#52FF5A',
                borderBottomWidth: 0.5,
                borderBottomColor: '#ccc',
            }}>
                <View style={{ marginRight: 10, }}>
                    <Image source={{ uri: 'https://picsum.photos/4000' }} style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#AED7FE',
                        borderColor: "white",
                        borderWidth: 0.5,
                    }} />
                </View>
                <View style={{ flex: 5.5, }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'black',
                    }}>{item.sender_id}</Text>
                    <Text style={{
                        fontSize: 12,
                        color: '#545556',
                    }}>{timeAgo(item.timestamps)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {item.liked ? <AntDesign name="heart" size={26} color="red" /> : null}
                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.storyItem}>
                <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center", borderRadius: 50, borderWidth: 3, borderColor: "#FF6262" }}
                    onPress={() => {
                        toggleSeeStory();
                    }}
                >
                    <Image source={{ uri: userImageUrl }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={{ color: "#B6B6B6", fontSize: 11 }}>{username.slice(0, 9)}</Text>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={seeStoryVisible}
                onRequestClose={toggleSeeStory}
            >
                <View style={{ flex: 1.5 }}>
                    <View style={{
                        alignItems: "center",
                        position: 'relative',
                    }}>
                        <View style={{
                            position: "absolute",
                            top: 10,
                            zIndex: 1,
                            flexDirection: "row",
                            gap: 260
                        }}>
                            <TouchableOpacity onPress={liked} >
                                <AntDesign name="heart" size={35} color="red" />
                                <Text style={{textAlign:"center",fontWeight:"bold"}}>
                                    {numberOfLikes}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleSeeStory} >
                                <MaterialIcons name="cancel" size={35} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Image source={{ uri: userImageUrl }} style={{ width: "100%", height: "100%" }} />
                    </View>
                </View>
                <FlatList
                    data={seenUsers}
                    renderItem={renderStorySeenUserList}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1 }}
                />
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    storyItem: {
        alignItems: 'center',
        marginHorizontal: 5
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    username: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "white"
    },

    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 5,
    },
    likeIcon: {
        marginRight: 5,
    },
    likes: {
        fontWeight: 'bold',
        color: "white"
    },
    comments: {
        paddingHorizontal: 10,
        color: 'gray',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default Story;
