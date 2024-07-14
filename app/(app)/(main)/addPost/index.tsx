import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, SafeAreaView } from 'react-native';
import { useSession } from '../../../../UserContext';
import { router } from 'expo-router';

const addPost = () => {
    const { userId, setUserId } = useSession();
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('Jharkhand,825318');
    const [photoUrl, setPhotoUrl] = useState(`https://picsum.photos/150`);

    function getRandomPhotoUrl() {
        const randomValue = Math.floor(Math.random() * 101) + 100;
        setPhotoUrl(`https://picsum.photos/${randomValue}`);
    }

    const addPost = async () => {
        try {
            if (description === "") {
                setDescription("Please type first then try to send OKAY!");
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDescription("");
                return;
            }

            const response = await fetch('http://192.168.31.86:8000/posts/add', {
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
                console.log('Post added successfully!');
                Alert.alert(
                    "Yeaaaaahhh!!",
                    "Post added successfully!"
                );
                router.replace("/");
                setDescription("");
            } else {
                console.error('Failed to add post');
            }
        } catch (error) {
            console.error('Error adding Post', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <View>
                    <Text style={{ color: "red" }}>{photoUrl}</Text>
                    <Image source={{ uri: photoUrl }} style={{ width: 200, height: 200 }} />
                    <TouchableOpacity onPress={getRandomPhotoUrl} style={{ backgroundColor: "gray", marginVertical: 5, borderRadius: 5, padding: 3 }}>
                        <Text style={{ color: "black" }}>Change Photo</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        placeholder={"ADD THE DESCRIPTION FOR YOUR POST"}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                        placeholder={"Adddress"}
                        placeholderTextColor="gray"
                    />
                    <TouchableOpacity onPress={addPost} style={{ borderRadius: 5, backgroundColor: "blue", justifyContent: "center", alignItems: "center", paddingVertical: 5, paddingHorizontal: 10, marginTop: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>


            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 10,
    },
    inputContainer: {
        alignItems: 'center',
        flexDirection: "row",
    },
    input: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 20,
        fontSize: 15,
        color: 'white',
        backgroundColor: "#222222",
    },
});

export default addPost;
