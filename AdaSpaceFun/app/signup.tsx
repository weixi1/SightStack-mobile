import { Colors } from "@/constants/Colors";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Popup from './popup';

const SignUp = () => {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const avatars = [
    'https://i.ibb.co/jmH8r5g/avatar0.jpg',
    'https://i.ibb.co/WvRgFxbd/avatar1.jpg',
    'https://i.ibb.co/Swn05jYX/avatar2.jpg',
    'https://i.ibb.co/5hwc44ZP/avatar3.jpg',
    'https://i.ibb.co/GzxyRcK/avatar4.jpg',
    'https://i.ibb.co/cS3S1kyv/avatar5.jpg',
    'https://i.ibb.co/Fk61BdrT/avatar6.jpg',
    'https://i.ibb.co/hFv9vsc9/avatar8.jpg',
    'https://i.ibb.co/zVk7b91j/avatar9.jpg',
  ];

  const validatePassword = (password) => password.length >= 6;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateAge = (age) => age >= 3 && age <= 12;

  const handleSaveProfile = async () => {
    if (!childName || !childAge || !selectedAvatar || !email || !password) {
      setPopupMessage('Please fill in all fields');
      setShowPopup(true);
      return;
    }
    if (!validateEmail(email) || !validatePassword(password) || !validateAge(Number(childAge))) {
      setPopupMessage('Please enter valid email, password, and age');
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post('https://sightstack-back-end.onrender.com/register', {
        childName,
        childAge: Number(childAge),
        email,
        password,
        avatar: selectedAvatar,
      });

      if (response.status === 201) {
        setPopupMessage('Profile saved successfully!');
        setShowPopup(true);
        setTimeout(() => {
          navigation.navigate('index');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setPopupMessage('Failed to save profile. Please try again.');
      setShowPopup(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter child's name"
          value={childName}
          onChangeText={setChildName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter child's age"
          value={childAge}
          onChangeText={setChildAge}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Avatar:</Text>
        <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.avatar,
              selectedAvatar === avatar && styles.selectedAvatar, // 如果选中了，应用选中样式
            ]}
            onPress={() => setSelectedAvatar(avatar)} // 点击时更新选中的头像
          >
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
        <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#003366', // 统一背景色
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAvatar: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  avatarImage: {
    width: '80%',
    height: '80%',
    borderRadius: 40,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#003366',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUp;