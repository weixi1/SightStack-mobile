import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import background from '@/assets/images/background.jpg'

const app = () => {
  return (
    <View style={styles.container}>
        <ImageBackground
        source={background}
        style={styles.image}
        >
        <Text style={styles.text}>AdaSpaceFun</Text>
        </ImageBackground>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        width: '100%', 
        height: '100%',
        flex: 1,
        justifyContent: 'center',

    },
    text:{
        fontSize: 42,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
})