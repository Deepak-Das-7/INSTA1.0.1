import { Stack } from 'expo-router'
import * as React from 'react'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: '#009170',
            },
            headerTintColor: "white",
            headerTitleStyle: {
                color: 'white',
                fontWeight: "400"
            },
            headerTitleAlign: "center",
            statusBarColor: "black",
            headerShadowVisible: false,
        }}>
            <Stack.Screen name="index" options={{ title: "Search", headerShown: false }} />
            <Stack.Screen name="about" options={{ title: "About" }} />
        </Stack>
    )
}
export default _layout;