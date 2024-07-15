import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, SafeAreaView } from 'react-native';
import { useSession } from '../../../../UserContext';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const addPost = () => {
    const { userId, setUserId } = useSession();
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
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
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ color: "red" }}>{photoUrl}</Text>
                    <Image source={{ uri: photoUrl }} style={{ width: 160, height: 160, borderRadius: 10, borderWidth: 1, borderColor: "yellow" }} />
                    <TouchableOpacity onPress={getRandomPhotoUrl}>
                        <MaterialIcons name="change-circle" size={30} color="white" />
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
                        onPress={addPost}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>Share</Text>
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
        padding: 5,
    },
    inputContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-between"
    },
    input1: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 20,
        fontSize: 14,
        color: 'black',
        backgroundColor: "white",
        height: 150,
    },
    input2: {
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        fontSize: 14,
        color: 'black',
        backgroundColor: "white",
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

export default addPost;
