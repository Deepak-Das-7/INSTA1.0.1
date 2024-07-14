import * as React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import logoDas from '../assets/logoDas.png';

const MessageList = ({ messages, onPress }) => {
    return (
        <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onPress()}>
                    <View style={styles.container}>
                        <View style={{ justifyContent: "flex-end", flex: 1.5 }}>
                            <Image
                                source={item.profilePicture ? { uri: item.profilePicture } : logoDas}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text numberOfLines={1} style={styles.message}>{item.email}</Text>
                        </View>
                        <View style={{ justifyContent: "flex-end", flex: 1.5 }}>
                            <Text style={styles.timestamp}>{item.createdAt.toLocaleString()}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    content: {
        flex: 5,
        justifyContent: "center"
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: "white",
        fontSize: 14
    },
    message: {
        color: 'white',
    },
    timestamp: {
        color: '#888888',
        marginLeft: 10,
        fontSize: 7,
    },
});

export default MessageList;