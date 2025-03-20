import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { useSession } from '../../../../UserContext';
import env from '../../../../config';


const socket = io(env.API_BASE_URL);

const RealTimeUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [posts, setPosts] = useState([]);
    const { userId } = useSession();

    useEffect(() => {
        fetchPosts();

        socket.on('update', (update) => {
            setUpdates((prevUpdates) => [...prevUpdates, update]);
        });

        return () => {
            socket.off('update');
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const likeImage = async (postId) => {
        try {
            await axios.post(`${env.API_BASE_URL}/reaction/like`, {
                userId: userId._id,
                username: userId.username,
                postId: postId,
            });
        } catch (error) {
            console.error('Error liking image:', error);
        }
    };

    const renderPostItem = ({ item }) => (
        <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
            <Image
                source={{ uri: item.photo }}
                style={{
                    width: 300,
                    height: 300,
                }}
            />
            <Text>{item.owner_id}</Text>
            <Text>{item.address}</Text>
            <Text>{item.description}</Text>
            <Button title="Like" onPress={() => likeImage(item._id)} />
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Button title="Refresh Posts" onPress={fetchPosts} />
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text>No posts available</Text>}
            />
            <View style={{ marginTop: 20 }}>
                <Text>Real-time updates:</Text>
                {updates.map((update, index) => (
                    <Text key={index}>
                        {update.data.username} liked post {update.data.postId} at{' '}
                        {new Date(update.data.timestamp).toLocaleTimeString()}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default RealTimeUpdates;
