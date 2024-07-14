import { Slot } from 'expo-router';
import { SessionProvider } from '../UserContext';
import * as React from 'react';

export default function Root() {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    );
}
