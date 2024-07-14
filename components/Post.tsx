import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, SafeAreaView, Alert } from 'react-native';
import { FontAwesome6, AntDesign, Feather, MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { useSession } from '../UserContext';
import logoDas from '../assets/test.jpg';

const InstagramPost = ({ item }) => {

    const { userId } = useSession();

    const [comments, setComments] = useState(item.comments);
    const [likes, setLikes] = useState(item.liked_user_id.length);
    const [description, setDescription] = useState(item.description);
    const [photo, setPhoto] = useState(item.photo);
    const [address, setAddress] = useState(item.address || "Jharkhand,800000");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [username, setUsername] = useState("");
    const [userImageUrl, setUserImageUrl] = useState(null);
    const [isLiked, setIsLiked] = useState(false);


    const updateStatus = async () => {
        try {
            const response = await axios.get(`http://192.168.31.161:8000/posts/${item._id}`);
            const userData = response.data;
            setComments(userData.comments);
            setLikes(userData.liked_user_id.length);
            setDescription(userData.description);
            setPhoto(userData.photo);
            setAddress(userData.address || "Jharkhand,800000");
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };
    const getOwnerDetails = async () => {
        try {
            const response = await axios.get(`http://192.168.31.161:8000/profile/${item.owner_id}`);
            const userData = response.data;
            setUsername(userData.username);
            setUserImageUrl(userData.profilePicture);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        updateStatus();
        getOwnerDetails();
        checkLikePresence();
    }, [])

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const liked = async () => {
        try {
            const response = await axios.post('http://192.168.31.161:8000/posts/liked', {
                post_id: item._id,
                senderId: userId.user_id,
            });
            console.log('liked successfully:', response.data);
            updateStatus();
            checkLikePresence();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const checkLikePresence = async () => {
        try {
            const response = await fetch('http://192.168.31.161:8000/posts/likedPresence', { // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: item._id, senderId: userId.user_id }),
            });

            if (response.ok) {
                const result = await response.json();
                setIsLiked(result.liked);
            } else {
                const error = await response.json();
                console.error('Error:', error.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async () => {
        console.log('Submitted comment:', commentText);
        if (commentText) {
            try {
                const response = await axios.post('http://192.168.31.161:8000/posts/comment', {
                    post_id: item._id,
                    senderId: userId.user_id,
                    text: commentText
                });
                console.log('Comment added successfully:', response.data);
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
        else {
            Alert.alert("Enter text before posting");
        }
        setCommentText('');
        updateStatus();
        // toggleModal();
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const secondsDifference = differenceInSeconds(now, date);

        if (secondsDifference < 60) {
            return `${secondsDifference} sec ago`;
        }

        const minutesDifference = differenceInMinutes(now, date);
        if (minutesDifference < 60) {
            return `${minutesDifference} min`;
        }

        const hoursDifference = differenceInHours(now, date);
        if (hoursDifference < 24) {
            return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''}`;
        }

        const daysDifference = differenceInDays(now, date);
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''}`;
    };


    const renderComment = ({ item }) => {

        const timeAgo = getTimeAgo(new Date(item.created_at));
        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10 }}>
                <Image source={{ uri: item.sender_photo || 'https://picsum.photos/4000' }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <Text style={{ fontWeight: 'bold', flex: 4, fontSize: 13 }}>{item.sender_username || "Unknown"}</Text>
                        <View style={{ justifyContent: 'center', flex: 1, }}>
                            <Text style={{ color: 'gray', fontSize: 10, }}>{timeAgo}</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 12 }}>{item.text}</Text>
                </View>
            </View>
        );
    };
    const flatListRef = useRef<FlatList<{ id: string; text: string }> | null>(null);

    const Deleting = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion canceled"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        console.log("Deleting the image");
                        try {
                            const response = await axios.post('http://192.168.31.161:8000/posts/delete', {
                                post_id: item._id,
                            });
                            console.log('Deleted successfully:', response.data);
                            Alert.alert("Deleted successfully", response.data.is_delete);
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert("Error deleting post");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: userImageUrl || 'https://example.com/placeholder.png' }} style={styles.profileImage} />
                <View style={{ justifyContent: "center", width: 260 }}>
                    <Text style={styles.username}>{username}</Text>
                    <View style={{ flexDirection: "row", marginLeft: -3 }}>
                        <MaterialIcons name="location-on" size={15} color="#3C67FC" />
                        <Text style={{ fontSize: 10, color: "gray" }}>{address}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity onPress={Deleting}>
                        <MaterialIcons name="delete" size={25} color="#686868" />
                    </TouchableOpacity>
                </View>
            </View>
            <Image source={{ uri: photo }} style={styles.postImage} />
            <View style={styles.footer}>
                <View style={{ flexDirection: "row", marginLeft: -5 }}>
                    <TouchableOpacity onPress={liked}>
                        {isLiked ? (
                            <AntDesign name="heart" size={24} color="red" style={styles.icon} />
                        ) : (
                            <AntDesign name="hearto" size={24} color="white" style={styles.icon} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <FontAwesome6 name="comment" size={24} color="white" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("Sent")}>
                        <Feather name="send" size={24} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => console.log("Saved")}>
                    <MaterialIcons name="save-alt" size={24} color="white" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.likesContainer}>
                <Text style={styles.likes}>{likes} {likes <= 1 ? 'like' : 'likes'}</Text>
            </View>
            <Text style={{ color: "white", marginLeft: 10, marginBottom: 1, fontSize: 12 }}>
                <Text style={{ fontWeight: "bold" }}>{username}</Text> {description}
            </Text>
            <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.comments}>{comments.length} {comments.length <= 1 ? 'Comment' : 'Comments'}</Text>
            </TouchableOpacity>
            <Modal visible={isModalVisible} onRequestClose={toggleModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                        <Entypo name="circle-with-cross" size={30} color="black" />
                    </TouchableOpacity>
                    <SafeAreaView style={{ flex: 1, marginRight: 20 }}>
                        {comments.length === 0 ? (
                            <View style={{ height: "80%", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 30, fontWeight: "500", fontStyle: "italic" }}>No Comment Yet</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={comments}
                                renderItem={renderComment}
                                keyExtractor={(item, index) => index.toString()}
                                ref={flatListRef}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            />
                        )}
                    </SafeAreaView>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopWidth: 0.4, paddingTop: 5 }}>
                        <TouchableOpacity style={{ flex: 1 }}>
                            <Image
                                source={userId.profilePicture ? { uri: userId.profilePicture } : logoDas}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                        </TouchableOpacity>
                        <TextInput
                            placeholder={`${userId.username}, comment here`}
                            value={commentText}
                            onChangeText={setCommentText}
                            style={styles.commentInput}
                        />
                        <TouchableOpacity onPress={handleSubmit} style={{ flex: 0.5 }}>
                            <FontAwesome name="send" size={30} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },
    username: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "white"
    },
    postImage: {
        width: '100%',
        height: 350,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    icon: {
        marginHorizontal: 10,
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
        color: "white",
        fontSize: 12
    },
    comments: {
        paddingHorizontal: 10,
        color: 'gray',
    },
    modalContainer: {
        flex: 1,
        height: '80%',
        marginTop: '20%',
        backgroundColor: 'yellow',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    commentInput: {
        flex: 4,
    },
});

export default InstagramPost;
