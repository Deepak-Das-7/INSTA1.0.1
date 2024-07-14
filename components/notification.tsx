import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Notification = ({ notification }) => {
    const renderNotificationMessage = () => {
        switch (notification.type) {
            case 'like':
                return `liked your photo`;
            case 'comment':
                return `commented: "${notification.comment}"`;
            case 'follow':
                return `started following you`;
            default:
                return '';
        }
    };

    return (
        <TouchableOpacity style={styles.container}>
            <Image source={{ uri: notification.contentThumbnail }} style={styles.avatar} />
            <View style={styles.content}>
                <Text style={styles.username}>{notification.user.username}</Text>
                <Text style={styles.message}>{renderNotificationMessage()}</Text>
            </View>
            <Image source={{ uri: notification.contentThumbnail }} style={styles.thumbnail} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: "white"
    },
    message: {
        color: "white"
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
});

export default Notification;