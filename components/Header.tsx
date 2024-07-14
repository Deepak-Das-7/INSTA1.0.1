import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';


const Header = ({ onPressNotification, onPressMessage }) => {
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginTop: 10
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                }}>Instagram</Text>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => onPressNotification()}>
                        <AntDesign name="hearto" size={24} color="white" style={{ marginRight: 20 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressMessage()}>
                        <AntDesign name="message1" size={24} color="white" style={{ marginRight: 0 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})