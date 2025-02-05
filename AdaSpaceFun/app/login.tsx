import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { useUser } from './usercontext'; // 导入 useUser

interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
  expanded?: boolean;
}

const Account: React.FC = () => {
  const { user, setUser } = useUser(); // 从 UserContext 中获取用户数据
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  useEffect(() => {
    if (user) {
      const updatedAchievements = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: user.achievements.includes(achievement.title),
        expanded: false, // 额外添加一个状态控制展开
      }));
      setAchievements(updatedAchievements);
    } else {
      setShowLoginModal(true); // 如果没有用户信息，显示登录弹出窗口
    }
  }, [user]);

  // 切换描述的显示
  const toggleDescription = (index: number) => {
    const updatedAchievements = achievements.map((achievement, i) => 
      i === index ? { ...achievement, expanded: !achievement.expanded } : achievement
    );
    setAchievements(updatedAchievements);
  };

  const handleLogin = () => {
    // 这里可以添加导航到登录页面的逻辑
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
              <Button title="Login" onPress={handleLogin} />
            </View>
          </View>
        </Modal>
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
});

export default Account;