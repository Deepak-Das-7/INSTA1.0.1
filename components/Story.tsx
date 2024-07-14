import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from '../UserContext';

const Story = ({ item }) => {

    const { userId } = useSession();
    const [comments, setComments] = useState(item.comments);
    const [description, setDescription] = useState(item.description);
    const [photo, setPhoto] = useState(item.photo);
    const [seeStoryVisible, setSeeStoryVisible] = useState(false);
    const [addStoryVisible, setAddStoryVisible] = useState(false);
    const [commentText, setCommentText] = useState('');

    const [username, setUsername] = useState("");
    const [userImageUrl, setUserImageUrl] = useState(null);

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

    useEffect(() => {
        getOwnerDetails();
    }, [])

    const toggleSeeStory = () => {
        setSeeStoryVisible(!seeStoryVisible);
    };
    const toggleAddStory = () => {
        setAddStoryVisible(!addStoryVisible);
    };

    const liked = async () => {
        try {
            const response = await axios.post('http://192.168.31.86:8000/posts/liked', {
                post_id: item._id,
                senderId: userId.user_id,
            });
            console.log('liked successfully:', response.data);
        } catch (error) {
            console.error('Error liking post:', error.response.data.error);
        }
    };

    const handleSubmit = async () => {
        console.log('Submitted comment:', commentText);
        try {
            const response = await axios.post('http://192.168.31.86:8000/posts/comment', {
                post_id: item._id,
                senderId: userId.user_id,
                text: commentText
            });
            console.log('Comment added successfully:', response.data);
        } catch (error) {
            console.error('Error adding comment:', error.response.data.error);
        }
        setCommentText('');
        toggleSeeStory();
    };

    const handleAddStory = async () => {
        try {
            if (description === "") {
                setDescription("Please type first then try to send OKAY!");
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDescription("");
                return;
            }
            const response = await fetch('http://192.168.31.86:8000/story/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: userId.user_id,
                    description: description,
                    photo: "https://picsum.photos/600/300"
                }),
            });

            if (response.ok) {
                console.log('Story added successfully!');
                setDescription("")
            } else {
                console.error('Failed to add story');
            }
        } catch (error) {
            console.error('Error adding Story', error);
        }
        toggleAddStory();
    };


    const renderComment = ({ item }) => {
        if (!item) {
            return null;
        }
        return (
            <View style={{}}>
                <Text style={{ fontSize: 13 }}>{item.text}</Text>
                <Text style={{ fontSize: 10, color: "gray" }}>{item.sender_id}</Text>
                <Text style={{ fontSize: 4, color: "red", marginBottom: 5 }}>{item.created_at}</Text>
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
