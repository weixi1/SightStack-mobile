import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios'; // Import axios

// Define the type for user data
interface User {
  childName: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data from the backend
  const fetchLeaderboard = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get<User[]>('http://localhost:5000/leaderboard');
      
      // Set the fetched data to state
      setLeaderboardData(response.data);
    } catch (err) {
      // Handle errors
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      // Set loading to false after the request is complete
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Loading state
  if (loading) {
    return <Text style={styles.loading}>Loading leaderboard...</Text>;
  }

  // Error state
  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  // Render leaderboard
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.medal}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
            </Text>
            <Text style={styles.childName}>{item.childName}</Text>
            <Text style={styles.score}>{item.score} points</Text>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#003366',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Comic Sans MS', // Fun font for a lively feel
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffcc00',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 10,
    backgroundColor: '#edf6f9',
    borderRadius: 8,
  },
  medal: {
    fontSize: 30,
    marginRight: 10,
  },
  childName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3d348b', // Golden color for the child's name
    fontFamily: 'Comic Sans MS', // Fun font for names
  },
  score: {
    fontSize: 18,
    color: '#03045e',
  },
});

export default Leaderboard;