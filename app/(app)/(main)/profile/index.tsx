import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../../../UserContext';
import logoDas from "../../../../assets/test.jpg";

const postsData = [
    { id: '1', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 1' },
    { id: '2', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 2' },
    { id: '3', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 3' },
    { id: '4', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 4' },
    { id: '5', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 5' },
    { id: '6', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 6' },
    { id: '7', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 7' },
    { id: '8', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 8' },
    { id: '9', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 9' },
    { id: '10', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 10' },
    { id: '11', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 1' },
    { id: '12', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 2' },
    { id: '13', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 3' },
    { id: '14', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 4' },
    { id: '15', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 5' },
    { id: '16', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 6' },
    { id: '17', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 7' },
    { id: '18', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 8' },
    { id: '19', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 9' },
    { id: '20', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 10' },
    { id: '21', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 1' },
    { id: '22', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 2' },
    { id: '23', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 3' },
    { id: '24', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 4' },
    { id: '25', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 5' },
    { id: '26', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 6' },
    { id: '27', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 7' },
    { id: '28', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 8' },
    { id: '29', imageUrl: require('../../../../assets/test.jpg'), caption: 'Placeholder Image 9' },
    { id: '30', imageUrl: require('../../../../assets/logoDas.png'), caption: 'Placeholder Image 10' },
];

const organizedData = [];
for (let i = 0; i < postsData.length; i += 3) {
    organizedData.push({ id: i, data: postsData.slice(i, i + 3) });
}

const ProfilePage = () => {
    const { userId, setUserId } = useSession();

    const renderPostItem = ({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, gap: 2 }}>
            {item.data.map((post, index) => (
                <TouchableOpacity key={index} style={{ flex: 1, alignItems: 'center' }} onPress={() => { console.log("Username is", userId.username) }}>
                    <Image style={{ width: '100%', height: 100, }} source={post.imageUrl} />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.profileHeader}>
                    <Image
                        source={userId.profilePicture ? { uri: userId.profilePicture } : logoDas}
                        style={styles.profileImage}
                    />
                    <Text style={styles.username}>{userId.username ? userId.username : "Unknown User"}</Text>
                </View>
                <View style={[styles.stats, { flex: 1, paddingVertical: 30 }]}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statCount}>100</Text>
                        <Text style={styles.statItem}>Posts</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statCount}>1000</Text>
                        <Text style={styles.statItem}>Followers </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statCount}>500</Text>
                        <Text style={styles.statItem}>Following </Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editProfileText}>Share Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}
                    onPress={() => {
                        Alert.alert(
                            "Confirm Logout",
                            "You will be logged out with this account",
                            [
                                {
                                    text: 'No',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => router.replace("/sign-in")
                                },
                            ],
                            { cancelable: true }
                        )
                    }}>
                    <AntDesign name="logout" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={organizedData}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.postsContainer}
            />
        </View>
    );
}

export default ProfilePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000"
    },
    profileHeader: {
        alignItems: 'center',
        margin: 10,
        marginRight: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "white",
    },
    editButton: {
        backgroundColor: '#1d2327',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    editProfileText: {
        color: 'white',
        fontSize: 16,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        fontSize: 14,
        color: "white",
    },
    statCount: {
        fontWeight: 'bold',
        fontSize: 17,
        color: "white",
    },
    postsContainer: {
        marginTop: 20,
        margin: 2
    },

});
