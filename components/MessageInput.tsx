import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageInput = ({ message, setMessage, sendMessage, username }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder={`Message ${username}`}
                placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send-sharp" size={35} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#D3D3D3',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
        color: 'white',
        backgroundColor: '#222222',
    },
});

export default MessageInput;
