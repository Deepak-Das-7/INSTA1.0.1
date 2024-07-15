import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, StatusBar, Modal } from 'react-native';
import Header from '../../../../components/Header';
import Post from '../../../../components/Post';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../../../UserContext';
import axios from 'axios';
import Story from '../../../../components/Story';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Alert } from 'react-native';


const HomeScreen = () => {
    const { userId, setUserId } = useSession();
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [photoUrl, setPhotoUrl] = useState(`https://picsum.photos/150`);

    const [posts, setPosts] = useState(null);
    const [stories, setStories] = useState(null);

    const [currentUserStory, setCurrentUserStory] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => {
        setModalVisible(false);
    }



    const fetchPosts = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`http://192.168.31.86:8000/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }

        setRefreshing(false);
    }

    const fetchStories = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`http://192.168.31.86:8000/story`);
            if (!response.data) {
                console.log("No stories");
                return;
            }

            const fetchedStories = response.data;

            const userStoryIndex = fetchedStories.findIndex(story => story.owner_id === userId.user_id);

            if (userStoryIndex !== -1) {
                const userStory = fetchedStories.splice(userStoryIndex, 1)[0]; // Remove and get the user's story
                setCurrentUserStory(userStory);
            } else {
                console.log("You don't have any stories", userId.email);
            }

            setStories(fetchedStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
        setRefreshing(false);
    }


    useEffect(() => {
        fetchStories();
        fetchPosts();
    }, []);

    const renderStoryItem = ({ item }) => {
        return (
            <Story item={item} />
        );
    };

    const renderPost = ({ item }) => {
        return (
            <Post item={item} />
        );
    };




    const flatListRef = useRef(null);

    const onPressMessage = () => {
        console.log('Pressed message:');
        router.push("/(main)/home/messages");
    };
    const onPressNotification = () => {
        console.log('Pressed notification:');
        router.push("/(main)/home/notifications");
    };
    const addStory = () => {
        console.log('Pressed message:');
        setModalVisible(true);
    }
    const addPostSTORY = async () => {
        console.log("adding story");
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
                    address: address,
                    photo: photoUrl
                }),
            });

            if (response.ok) {
                console.log('Story added successfully!');
                router.replace("/");
                setDescription("");
            } else {
                console.error('Failed to add post');
            }
        } catch (error) {
            console.error('Error adding Post', error);
        }
        setModalVisible(false);
    };
    function getRandomPhotoUrl() {
        const randomValue = Math.floor(Math.random() * 101) + 100;
        setPhotoUrl(`https://picsum.photos/${randomValue}`);
    }

    return (
        <View style={{ backgroundColor: "#000000", }}>
            <StatusBar backgroundColor='#000000' barStyle='light-content' />
            <View>
                <Header onPressMessage={onPressMessage} onPressNotification={onPressNotification} />


                <View style={{
                    height: 110, borderBottomWidth: 0.17,
                    borderBottomColor: '#ddd7',
                    flexDirection: 'row'
                }}>
                    <View style={{
                        alignItems: 'center',
                        marginHorizontal: 5,
                        backfaceVisibility: 'visible'
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!currentUserStory) { addStory() }
                                else {
                                    Alert.alert(
                                        "Story Already Exists",
                                        "You already have a story. Do you want to add another and replace existing one?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "Add Story",
                                                onPress: () => addStory()
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                            }}

                            style={{
                                justifyContent: "center", alignItems: "center", borderRadius: 50, borderWidth: 3,
                                borderColor: currentUserStory ? "green" : "#5E9BFE"
                            }}
                        >
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40
                            }}>
                                {currentUserStory ? (
                                    <Image
                                        source={{ uri: currentUserStory.photo }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                        }}
                                    />
                                ) : (
                                    <MaterialIcons name="add" size={80} color="gray" />
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text style={{ color: "#B6B6B6", fontSize: 11 }}>You</Text>
                    </View>
                    <FlatList
                        data={stories}
                        renderItem={renderStoryItem}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={true}
                    />
                </View>


                <View style={{ paddingBottom: 520 }} >
                    <FlatList
                        ref={flatListRef}
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={(_, index) => index.toString()}
                        refreshing={refreshing}
                        onRefresh={() => {
                            fetchPosts();
                            fetchStories();
                        }}
                    />
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.inputContainer}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ color: "red" }}>{photoUrl}</Text>
                        <Image source={{ uri: photoUrl }} style={{ width: 160, height: 160, borderRadius: 10, borderWidth: 1, borderColor: "black" }} />
                        <TouchableOpacity onPress={getRandomPhotoUrl}>
                            <MaterialIcons name="change-circle" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.input1}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            placeholder={"Description..."}
                            placeholderTextColor="gray"
                            multiline={true}
                            numberOfLines={4}
                        />
                        <TextInput
                            style={styles.input2}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                            placeholder={"Adddress"}
                            placeholderTextColor="gray"
                            multiline={true}
                        />
                        <TouchableOpacity
                            onPress={addPostSTORY}
                            style={styles.button}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonText}>Add story</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.button}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonText}>Quit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-between",
        padding: 5
    },
    input1: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 20,
        fontSize: 14,
        color: 'black',
        backgroundColor: "#BBDAFA",
        height: 150,
    },
    input2: {
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        fontSize: 14,
        color: 'black',
        backgroundColor: "#B1B2B4",
    },
    button: {
        borderRadius: 8,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 10,
        elevation: 3,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    }
});

export default HomeScreen;