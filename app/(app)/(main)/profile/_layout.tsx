import { Stack } from 'expo-router'
import * as React from 'react'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerTintColor: "white",
            headerTitleStyle: {
                color: 'white',
                fontWeight: "400"
            },
            headerTitleAlign: "center",
            statusBarColor: "black",
            headerShadowVisible: false,
            headerShown: false
        }}>
            <Stack.Screen name="index" options={{ title: "Profile" }} />
        </Stack>
    )
}
export default _layout;