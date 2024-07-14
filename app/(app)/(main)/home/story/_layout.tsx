import { Stack } from 'expo-router'
import * as React from 'react'
import { View, Text, Image } from 'react-native';

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
                headerTitle: "Story"
            }} />
        </Stack>
    )
}

export default _layout;
