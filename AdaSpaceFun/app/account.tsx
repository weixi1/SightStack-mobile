import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios, { get } from 'axios'; // 导入 axios
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
  expanded?: boolean;
}

interface User {
  name: string;
  avatar: any; // 修改类型，适应 require 语法
  age: number;
  score: number;
  achievements: string[];
}

const UserInfo: React.FC = () => {
  const route = useRoute();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // 所有成就列表
  const allAchievements: Achievement[] = [
    { title: "🌑 Mercury Explorer", description: "Like the swift Mercury 🌕, you've taken your first steps in solving games! 🚀", unlocked: false },
    { title: "🌟 Venus Voyager", description: "Your problem-solving is as radiant as Venus in the night sky 🌘. Great work on your games! 🌍", unlocked: false },
    { title: "🌍 Earth Defender", description: "You've defended Earth 🌏 from the challenges of games. Keep it up! 🛡️", unlocked: false },
    { title: "💫 Mars Adventurer", description: "Your adventurous spirit has led you to conquer the challenges of Mars! 🔴", unlocked: false },
    { title: "🛸 Jupiter Giant", description: "Like Jupiter 🌑, your skills in games are gigantic! 💫", unlocked: false },
    { title: "🪐 Saturn Strategist", description: "Your strategic mind has helped you solve the rings of challenges! 🪐", unlocked: false },
    { title: "🌌 Uranus Innovator", description: "Your innovative solutions have made you a master of games! 🌟", unlocked: false },
    { title: "🌠 Neptune Navigator", description: "You're navigating the deep oceans of games, just like Neptune rules the seas! 🌑🌊", unlocked: false },
    { title: "🏆 Solar System Champion", description: "Congratulations! You've obtained more than 300 points and earned your place as a true Game Master! 🚀🌟", unlocked: false }
  ];

  // 使用 axios 获取用户数据
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 从路由参数获取 userId
        const userJson = await AsyncStorage.getItem('user');
        const data = userJson ? JSON.parse(userJson) as User : null;

        // 假设 API 返回的数据符合预期
        setUser(data);

      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      const updatedAchievements = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: user.achievements.includes(achievement.title),
        expanded: false, // 额外添加一个状态控制展开
      }));
      setAchievements(updatedAchievements);
    }
  }, [user]);

  // 切换描述的显示
  const toggleDescription = (index: number) => {
    const updatedAchievements = achievements.map((achievement, i) => 
      i === index ? { ...achievement, expanded: !achievement.expanded } : achievement
    );
    setAchievements(updatedAchievements);
  };

  if (!user) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.name && (
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Image source={user.avatar} style={styles.avatarImage} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.age}>Age: {user.age}</Text>
              <Text style={styles.score}>Total Score: <Text style={styles.bold}>{user.score}</Text></Text>
            </View>
          </View>

          {/* 成就部分 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievements}>
              {achievements.map((achievement, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.achievement, achievement.unlocked ? styles.unlocked : styles.locked]}
                  onPress={() => achievement.unlocked && toggleDescription(index)}
                  disabled={!achievement.unlocked}
                >
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  {achievement.unlocked && achievement.expanded && (
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#003366',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  age: {
    fontSize: 16,
    color: '#666',
  },
  score: {
    fontSize: 16,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievement: {
    width: '48%',
    backgroundColor: '#eaf6ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  unlocked: {
    opacity: 1,
  },
  locked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});

export default UserInfo;
