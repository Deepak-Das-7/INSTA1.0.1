import { View, Image } from 'react-native'
import * as React from 'react'

const Logo = () => {
    return (
        <View style={{ alignItems: "center", }}>
            <Image
                style={{ width: 200, height: 200 }}
                source={require('../assets/logoDas.png')}
            />
        </View>
    )
}

export default Logo;