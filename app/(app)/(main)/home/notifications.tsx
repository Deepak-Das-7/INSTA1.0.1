import * as React from 'react';
import { ScrollView } from 'react-native';

import Notification from '../../../../components/notification';
const NotificationsScreen = () => {

    const notificationsData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        user: {
            profilePicture: "https://source.unsplash.com/user/c_v_r/1900x800",
            username: "Deepak",
        },
        type: "comment",
        comment: "Hszdfghjkn csdjcdbjcvhjc",
        contentThumbnail: "https://source.unsplash.com/user/c_v_r/100x100"
    }));

    return (
        <ScrollView style={{ backgroundColor: '#000000' }}>
            {notificationsData.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </ScrollView>
    );
};

export default NotificationsScreen;