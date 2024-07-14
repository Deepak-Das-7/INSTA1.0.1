import * as React from 'react';
import { Tabs } from 'expo-router/tabs';
import { Ionicons, Foundation, FontAwesome5, Octicons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import { useSession } from '../../../UserContext';
import logoDas from '../../../assets/test.jpg';



const AppLayout = () => {
    const { userId } = useSession();

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "#4B4949",
            tabBarStyle: {
                minHeight: 60,
                backgroundColor: "black",
                paddingBottom: 8,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: "",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Foundation name="home" size={28} color="white" />
                        ) : (
                            <Foundation name="home" size={26} color="#BBBBBB" />
                        ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    // headerShown: false,
                    title: "",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="search" size={28} color="white" />
                        ) : (
                            <Ionicons name="search" size={26} color="#BBBBBB" />
                        ),
                }}
            />
            <Tabs.Screen
                name="addPost"
                options={{
                    // headerShown: false,
                    title: "",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <FontAwesome5 name="plus-square" size={28} color="white" />
                        ) : (
                            <FontAwesome5 name="plus-square" size={26} color="#BBBBBB" />
                        ),
                }}
            />
            <Tabs.Screen
                name="reels"
                options={{
                    // headerShown: false,
                    title: "",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Octicons name="video" size={28} color="white" />
                        ) : (
                            <Octicons name="video" size={26} color="#BBBBBB" />
                        ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Image
                                source={userId.profilePicture ? { uri: userId.profilePicture } : logoDas}
                                style={styles.avatar}
                            />
                        ) : (
                            <Image
                                source={userId.profilePicture ? { uri: userId.profilePicture } : logoDas}
                                style={styles.avatar}
                            />
                        ),
                }}
            />
        </Tabs>
    );
};

export default AppLayout;
const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    }
});