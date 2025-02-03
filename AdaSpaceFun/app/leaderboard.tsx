import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Define the type for user data
interface User {
  childName: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated data for testing
  const fetchLeaderboard = async () => {
    try {
      // Simulated fetch request with dummy data
      const simulatedData: User[] = [
        { childName: 'John', score: 150 },
        { childName: 'Alice', score: 120 },
        { childName: 'Bob', score: 100 },
        { childName: 'Charlie', score: 80 },
        { childName: 'Lily', score: 50 },
        { childName: 'Joe', score: 10 },
        { childName: 'Anna', score: 0 },
      ];
      setLeaderboardData(simulatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Component mount, simulate API call
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
