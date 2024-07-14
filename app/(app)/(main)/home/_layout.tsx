import { Stack } from 'expo-router'
import * as React from 'react'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerTitleStyle: {
                color: 'white',
                fontWeight: "400",
            },
            headerStyle: {
                backgroundColor: '#000000',
            },
            statusBarColor: "black",
            headerTitleAlign: "center",
            headerTintColor: "white",
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false,
            }} />
            <Stack.Screen name="story" options={{
                headerShown: false,
                headerTitle: "Story"
            }} />
            <Stack.Screen name="messages" options={{
                headerShown: false,
                headerTitle: "Messages"
            }} />
            <Stack.Screen name="notifications" options={{
                headerTitle: "Notifications"
            }} />

        </Stack>
    )
}

export default _layout;