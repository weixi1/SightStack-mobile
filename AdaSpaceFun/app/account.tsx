import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Achievement {
  title: string;
  description: string;
  required_score: number;
  unlocked: boolean;
  expanded?: boolean;
}

interface User {
  avatar: string;
  childName: string;
  childAge: number;
  score: number;
  userId: number;
  achievements: Achievement[]; // 添加 achievements 字段
}

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [lockedAchievement, setLockedAchievement] = useState<Achievement | null>(null);

  const apiServer = 'https://sightstack-back-end.onrender.com';

  // 所有成就列表
  const allAchievements: Achievement[] = [
    { title: "🌑 Mercury Explorer", description: "Like the swift Mercury 🌕, you've taken your first steps in solving games! 🚀", required_score: 10, unlocked: false },
    { title: "🌟 Venus Voyager", description: "Your problem-solving is as radiant as Venus in the night sky 🌘. Great work on your games! 🌍", required_score: 30, unlocked: false },
    { title: "🌍 Earth Defender", description: "You've defended Earth 🌏 from the challenges of games. Keep it up! 🛡️", required_score: 50, unlocked: false },
    { title: "💫 Mars Adventurer", description: "Your adventurous spirit has led you to conquer the challenges of Mars! 🔴", required_score: 80, unlocked: false },
    { title: "🛸 Jupiter Giant", description: "Like Jupiter 🌑, your skills in games are gigantic! 💫", required_score: 100, unlocked: false },
    { title: "🪐 Saturn Strategist", description: "Your strategic mind has helped you solve the rings of challenges! 🪐", required_score: 150, unlocked: false },
    { title: "🌌 Uranus Innovator", description: "Your innovative solutions have made you a master of games! 🌟", required_score: 200, unlocked: false },
    { title: "🌠 Neptune Navigator", description: "You're navigating the deep oceans of games, just like Neptune rules the seas! 🌑🌊", required_score: 260, unlocked: false },
    { title: "🏆 Solar System Champion", description: "Congratulations! You've obtained more than 300 points and earned your place as a true Game Master! 🚀🌟", required_score: 300, unlocked: false }
  ];

  useEffect(() => {
    // 从 AsyncStorage 获取用户数据
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // 更新状态
      } else {
        setShowLoginModal(true); // 如果没有用户数据，显示登录弹出窗口
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user && user.userId) {
        try {
          // 发送 GET 请求获取用户详细信息
          const response = await fetch(`${apiServer}/userInfo?userId=${user.userId}`);
          if (response.ok) {
            const data = await response.json();
            const updatedUser = {
              avatar: data.avatar,
              childName: data.childName,
              childAge: data.childAge,
              score: data.score,
              userId: data.userId,
              achievements: data.achievements,
            };
            setUser(updatedUser);

            // 更新成就信息
            const updatedAchievements = allAchievements.map(achievement => ({
              ...achievement,
              unlocked: updatedUser.score >= achievement.required_score,
              expanded: false, // 额外添加一个状态控制展开
            }));
            setAchievements(updatedAchievements);
          } else {
            console.error('Failed to fetch user info');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    fetchUserInfo();
  }, [user]); // 只有当 user 信息发生变化时才会触发此请求

  // 切换描述的显示
  const toggleDescription = (index: number) => {
    const updatedAchievements = achievements.map((achievement, i) => 
      i === index ? { ...achievement, expanded: !achievement.expanded } : achievement
    );
    setAchievements(updatedAchievements);
  };
  
  // 新增：处理点击未解锁成就时的提示
  const handleLockedAchievementPress = (achievement: Achievement) => {
    setLockedAchievement(achievement);
  };

  const logout = async () => {
    // 删除 AsyncStorage 中的用户数据
    await AsyncStorage.removeItem('user');
    setUser(null); // 清除用户状态
  };

  const handleLogin = () => {
    router.push('/');
    setShowLoginModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user.childName}</Text>
              <Text style={styles.age}>Age: <Text style={styles.bold}>{user.childAge}</Text></Text>
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
                onPress={() => {
                  if (achievement.unlocked) {
                    toggleDescription(index);
                  } else {
                    handleLockedAchievementPress(achievement);
                  }
                }}
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
      ) : (
        <Modal
          visible={showLoginModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Please login to view your account.</Text>
              <Button title="Close" onPress={handleLogin} />
            </View>
          </View>
        </Modal>
      )}
      {/* 新增：未解锁成就提示弹窗 */}
      <Modal visible={!!lockedAchievement} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You need {lockedAchievement?.required_score} points to unlock🔓!
            </Text>
            <Button title="OK" onPress={() => setLockedAchievement(null)} />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
});


export default Account;