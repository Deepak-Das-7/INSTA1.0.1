import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns-tz'; // Import format from date-fns-tz

const Message = ({ msg, isSentByMe }) => {
    const createdAtDate = new Date(msg.createdAt);
    const formattedTime = format(createdAtDate, 'hh:mm a'); // Use format from date-fns-tz

    return (
        <View key={msg._id} style={{ marginBottom: 10, alignItems: isSentByMe ? 'flex-end' : 'flex-start' }}>
            <View
                style={[
                    styles.messageContainer,
                    { alignSelf: isSentByMe ? 'flex-end' : 'flex-start', backgroundColor: isSentByMe ? '#942AFF' : '#333333' },
                    { maxWidth: '90%' },
                ]}
            >
                <Text style={styles.messageText}>{msg.text}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: isSentByMe ? 'flex-end' : 'flex-start' }}>
                <Text
                    style={{
                        color: '#969697',
                        fontSize: 8,
                        textAlign: isSentByMe ? 'right' : 'left',
                    }}
                >
                    {formattedTime}
                </Text>
                {isSentByMe && msg.viewed && (
                    <Ionicons name="checkmark-done" size={12} color="#29BA1A" style={styles.checkmark} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
        borderRadius: 10,
    },
    messageText: {
        fontSize: 14,
        color: 'white',
    },
    checkmark: {
        marginLeft: 5,
    },
});

export default Message;
