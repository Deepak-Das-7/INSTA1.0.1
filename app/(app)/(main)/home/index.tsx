import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Modal } from 'react-native';
import Header from '../../../../components/Header';
import Post from '../../../../components/Post';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../../../UserContext';
import axios from 'axios';
import Story from '../../../../components/Story';
import { MaterialIcons } from '@expo/vector-icons';


const HomeScreen = () => {
    const { userId } = useSession();
    const [posts, setPosts] = useState(null);
    const [stories, setStories] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    let count = 1;



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
            setStories(response.data);
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
                            style={{
                                justifyContent: "center", alignItems: "center", borderRadius: 50, borderWidth: 3,
                                borderColor: userId.profilePicture ? "green" : "#5E9BFE"
                            }}
                        >
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40
                            }}>
                                {userId.profilePicture ? (
                                    <Image
                                        source={{ uri: userId.profilePicture }}
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
        </View >
    );
};

const styles = StyleSheet.create({

});

export default HomeScreen;