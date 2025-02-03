import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'; // 使用 Expo Router 的导航工具

interface Grade {
  label: string;
  className: string;
}

const MainHome: React.FC = () => {
  const router = useRouter(); // 使用 useRouter 钩子

  const grades: Grade[] = [
    { label: "Pre-K", className: "pre-k" },
    { label: "Grade K", className: "grade-k" },
    { label: "Grade 1", className: "grade-1" },
    { label: "Grade 2", className: "grade-2" },
    { label: "Grade 3", className: "grade-3" },
    { label: "Grade 4", className: "grade-4" },
    { label: "Grade 5", className: "grade-5" },
    { label: "Grade 6+", className: "grade-6" },
  ];

  const navigateToDailyGame = () => {
    router.push({ pathname: '/game', params: { type: 'daily' } });
  };

  const navigateToGame = (grade: string) => {
    router.push({ pathname: '/game', params: { grade } }); // 导航到游戏页面并传递参数
  };

  return (
    <ImageBackground source={require('@/assets/images/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.mainCircle} onPress={navigateToDailyGame}>
          <Text style={styles.sunText}>Daily Game</Text>
        </TouchableOpacity>

        <View style={styles.gradeContainer}>
          {grades.map((grade, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.gradeCircle, styles[grade.className]]}
              onPress={() => navigateToGame(grade.className)}
            >
              <Text style={styles.gradeText}>{grade.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // 或者 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ffd700',
    borderWidth: 10,
    borderColor: '#ffce00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sunText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  gradeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // Use elevation for Android
    elevation: 5,
    // Use shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  // 动态颜色样式
  'pre-k': { backgroundColor: '#ff6b6b' },
  'grade-k': { backgroundColor: '#ffd700' },
  'grade-1': { backgroundColor: '#4caf50' },
  'grade-2': { backgroundColor: '#2196f3' },
  'grade-3': { backgroundColor: '#9c27b0' },
  'grade-4': { backgroundColor: '#ff5722' },
  'grade-5': { backgroundColor: '#795548' },
  'grade-6': { backgroundColor: '#607d8b' },
});

export default MainHome;