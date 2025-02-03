import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleClose = () => {
        navigation.goBack();
    };

    const handleSubmit = async () => {
        // 发送登录请求到后端
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('userId', data.userId); 

                // 直接跳转到主页
                navigation.navigate('Home'); 
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData.error);
                // 这里可以替换为其他的错误处理方式，比如显示一个Toast消息
            }
        } catch (error) {
            console.error('Error during login:', error);
            // 这里可以替换为其他的错误处理方式，比如显示一个Toast消息
        }
        console.log('Sending login request:', { email, password });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#003366',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#003366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#003366',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LogIn;