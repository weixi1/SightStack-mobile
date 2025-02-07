import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native'
import React from 'react'
import background from '@/assets/images/background.jpg'
import { Link } from 'expo-router'

const app = () => {
  return (
    <View style={styles.container}>
        <ImageBackground
        source={background}
        style={styles.image}
        >
        <Text style={styles.title}>AdaSpaceFun</Text>
        <Text style={styles.suptitle}>Spelling Practice</Text>
        <View style={styles.buttonContainer}>
            <Link href="/rules" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Rules</Text>
            </Pressable>
            </Link>



            <Link href="/main" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Game</Text>
            </Pressable>
            </Link>

            <Link href="/signup" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            </Link>

            <Link href="/login" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            </Link>

            <Link href="/account" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Account</Text>
            </Pressable>
            </Link>

            <Link href="/leaderboard" style={{marginHorizontal:'auto'}} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Leaderboard</Text>
            </Pressable>
            </Link>
        </View>
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
    title:{
        fontSize: 42,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 120,
    },

    suptitle:{
        fontSize: 18,
        color: '#ccc',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 100,
        marginTop: -100, 
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        height: 60,
        width: 200,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.5)',
        padding: 6,
        margin: 10, // 调整按钮之间的间距
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 4,
    }
})