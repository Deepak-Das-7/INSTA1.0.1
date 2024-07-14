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
            <Stack.Screen name="index" options={{ title: "reels" }} />
            <Stack.Screen name="reel" options={{ title: "Reel" }} />
        </Stack>
    )
}
export default _layout;