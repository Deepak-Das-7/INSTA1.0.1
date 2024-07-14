import { View, Image } from 'react-native'
import * as React from 'react'

const SmLogo = () => {
    return (
        <View style={{ alignItems: "center", }}>
            <Image
                style={{ width: 50, height: 50 }}
                source={require('../assets/logoDas.png')}
            />
        </View>
    )
}

export default SmLogo;