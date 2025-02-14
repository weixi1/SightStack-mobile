import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router, useRouter } from 'expo-router';
import Popup from './popup';
import { useUser } from './usercontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserId = async (userId: number) => {
    try {
        await AsyncStorage.setItem('userId', userId.toString());
    } catch (error) {
        console.error('Error storing user ID:', error);
    }

    // 读取并打印存储的用户 ID，确认存储成功
    const storedUserId = await AsyncStorage.getItem('userId');
    console.log("✅: Retrieved User ID from AsyncStorage:", storedUserId);
};

const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { setUser } = useUser(); 

    const handleClose = () => {
        navigation.goBack();
    };

    const handleSubmit = async () => {
        // 发送登录请求到后端
        try {
            const response = await fetch('https://sightstack-back-end.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);

                setUser(data);

                // 调用 storeUserId 函数存储 user_id 到 AsyncStorage
                // if (data.userId) {
                //     await storeUserId(data.userId); // 确保存储操作完成
                // }

                if (data) {
                    await AsyncStorage.setItem('user', JSON.stringify(data)); // 存储完整的用户数据
                    await storeUserId(data.userId); // 如果只需要存储 userId，也可以单独存储
                }

                // 显示成功的 Popup
                setPopupMessage('Login successful!');
                setShowPopup(true);

                // 2 秒后跳转到主页，确保异步操作已经完成
                setTimeout(() => {
                    setShowPopup(false);
                    router.push('/');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData.error);
                setPopupMessage(errorData.error || 'Login failed');
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setPopupMessage('An error occurred during login');
            setShowPopup(true);
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
            <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
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