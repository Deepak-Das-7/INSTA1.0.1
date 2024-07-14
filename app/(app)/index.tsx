import React from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '../../UserContext';

export default function Index() {
    const { userId } = useSession();
    if (!userId) {
        // return <Redirect href="/sign-in" />
        // return <Redirect href="./(main)/profile" />
        // return <Redirect href="./(main)/reels" />
        // return <Redirect href="./(main)/search" />
        // return <Redirect href="./(main)/home" />
        return <Redirect href="./(main)/addPost" />

    }
    return <Redirect href="./(main)/home" />
}