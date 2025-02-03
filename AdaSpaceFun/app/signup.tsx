import { Colors } from "@/constants/Colors";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const avatars = [
    require('@/assets/images/avatar0.jpg'),
    require('@/assets/images/avatar1.jpg'),
    require('@/assets/images/avatar2.jpg'),
    require('@/assets/images/avatar3.jpg'),
    require('@/assets/images/avatar4.jpg'),
    require('@/assets/images/avatar5.jpg'),
    require('@/assets/images/avatar6.jpg'),
    require('@/assets/images/avatar7.jpg'),
    require('@/assets/images/avatar8.jpg'),
    require('@/assets/images/avatar9.jpg'),
  ];

  const validatePassword = (password) => password.length >= 6;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateAge = (age) => age >= 3 && age <= 12;

  const handleSaveProfile = async () => {
    if (!childName || !childAge || !selectedAvatar || !email || !password) {
      return;
    }
    if (!validateEmail(email) || !validatePassword(password) || !validateAge(Number(childAge))) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        childName,
        childAge,
        email,
        password,
        avatar: selectedAvatar,
      });

      if (response.status === 201) {
        setTimeout(() => {
          navigation.navigate('Home');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
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
                selectedAvatar === avatar && styles.selectedAvatar,
              ]}
              onPress={() => setSelectedAvatar(avatar)}
            >
              <Image source={avatar} style={styles.avatarImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
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
    borderColor: '#fff',
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
