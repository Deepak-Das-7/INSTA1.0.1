import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, isToday } from 'date-fns';
import Message from './Message';

const MessageGroup = ({ item, userId }) => {
    const { date, msgs } = item;
    const formattedDate = isToday(new Date(date)) ? 'Today' : format(new Date(date), 'dd/MM/yyyy');

    return (
        <View>
            <Text style={styles.dateText}>{formattedDate}</Text>
            {msgs.map((msg) => (
                <Message key={msg._id} msg={msg} isSentByMe={msg.sender_id === userId.user_id} userId={userId} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    dateText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default MessageGroup;
