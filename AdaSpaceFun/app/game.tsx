import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Popup from './popup';
import background from '@/assets/images/background.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Word {
  word: string;
  hint: string;
  level: string;
}

const gradeToLevel = (grade: string): string => {
  switch (grade) {
    case 'pre-k': return 'prek';
    case 'grade-k': return 'k';
    case 'grade-1': return '1st';
    case 'grade-2': return '2nd';
    case 'grade-3': return '3rd';
    case 'grade-4': return '4th';
    case 'grade-5': return '5th';
    case 'grade-6': return '6th';
    default: return 'prek'; // Default to prek if grade is invalid
  }
};

const apiServer = 'https://sightstack-back-end.onrender.com';

const fetchOptions: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const fetchWordByLevel = async (level: string): Promise<Word> => {
  try {
    const response = await fetch(`${apiServer}/words/level/${level}`, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch word for level ${level}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching word:', err);
    throw new Error('Error fetching word: ' + err);
  }
};

const fetchDailyWord = async (): Promise<Word> => {
  try {
    const response = await fetch(`${apiServer}/words/daily`, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch daily word');
    }
    return await response.json();
  } catch (err) {
    throw new Error('Error fetching daily word: ' + err);
  }
};

const updateUserScore = async (userId: string, score: number) => {
  try {
    const response = await fetch(`${apiServer}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, score }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update user score');
    }

    console.log('Score updated successfully:', result);
    return result;
  } catch (err) {
    console.error('Error updating user score:', err);
    throw err;
  }
};

const Game: React.FC = () => {
  const router = useRouter();
  const { type = 'daily', grade = '' } = useLocalSearchParams();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [shuffledWord, setShuffledWord] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const requestPermissions = async () => {
      await Audio.requestPermissionsAsync();
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const savedUserId = await AsyncStorage.getItem('userId');
      if (savedUserId) {
        setUserId(savedUserId);
      } else {
        const generatedUserId = `user-${Math.floor(Math.random() * 10000)}`;
        await saveUserId(generatedUserId);
      }
    };
    getUserId();
  }, []);

  const saveUserId = async (userId: string) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      setUserId(userId);
    } catch (error) {
      console.error('Failed to save userId:', error);
    }
  };

  const playSound = () => {
    if (currentWord) {
      Speech.speak(currentWord.hint);
    }
  };

  const startGame = async () => {
    try {
      let randomWord: Word;
      if (type === 'daily') {
        randomWord = await fetchDailyWord();
      } else if (type === 'grade' && grade) {
        const level = gradeToLevel(grade);
        randomWord = await fetchWordByLevel(level);
      } else {
        throw new Error('Invalid game type or missing grade');
      }

      setCurrentWord(randomWord);
      setShuffledWord(shuffleArray(randomWord.word.split('')));
      setAnswer(Array(randomWord.word.length).fill(''));
      setShowHint(false);
      setIsCompleted(false);
    } catch (err) {
      console.error('Failed to start game:', err);
      setPopupMessage(err.message || 'Error starting the game.');
      setIsPopupOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (currentWord && answer.join('') === currentWord.word) {
      const newScore = 1;
      setScore(newScore);
      setIsCompleted(true);
      setPopupMessage('Correct!');
      setIsPopupOpen(true);

      try {
        if (userId) {
          await updateUserScore(userId, newScore);
        } else {
          console.error('No userId found');
        }
      } catch (err) {
        console.error('Failed to update score:', err);
        setPopupMessage('Failed to update score');
        setIsPopupOpen(true);
      }

      setTimeout(() => {
        startGame();
        setIsPopupOpen(false);
      }, 2000);
    } else {
      setPopupMessage('Try again!');
      setIsPopupOpen(true);
      setTimeout(() => {
        setAnswer(Array(answer.length).fill(''));
        setIsPopupOpen(false);
      }, 2000);
    }
  };

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleLetterClick = (letter: string) => {
    const emptyIndex = answer.findIndex((char) => char === '');
    if (emptyIndex !== -1) {
      const newAnswer = [...answer];
      newAnswer[emptyIndex] = letter;
      setAnswer(newAnswer);
    }
  };

  const goBackToHome = () => {
    router.push('/');
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={startGame} style={styles.button}>
            <Text style={styles.buttonText}>{isCompleted ? 'New Game' : 'Play'}</Text>
          </TouchableOpacity>
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
          <TouchableOpacity onPress={goBackToHome} style={styles.button}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.mainArea}>
          {currentWord && (
            <>
              <View style={styles.puzzle}>
                {shuffledWord.map((letter, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.letter}
                    onPress={() => handleLetterClick(letter)}
                  >
                    <Text style={styles.letterText}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.placeholders}>
                {answer.map((letter, index) => (
                  <TouchableOpacity key={index} style={styles.placeholder}>
                    <Text style={styles.placeholderText}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => setShowHint(!showHint)} style={styles.hintButton}>
                <Text style={styles.hintButtonText}>{showHint ? 'Hide Hint' : 'Show Hint'}</Text>
              </TouchableOpacity>
              {showHint && (
                <View style={styles.hintsSection}>
                  <Text style={styles.hintText}>Hint: {currentWord.hint}</Text>
                  <TouchableOpacity onPress={playSound} style={styles.speakerIcon}>
                    <Ionicons name="volume-high" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => setAnswer(Array(answer.length).fill(''))} style={styles.button}>
            <Text style={styles.buttonText}>Replay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} message={popupMessage} />
        </View>
      </View>
    </ImageBackground>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover', 
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明背景
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15, // 让按钮更大
    backgroundColor: '#0066cc',
    borderRadius: 12, // 让按钮更圆润
    alignItems: 'center',
    minWidth: 100, // 让按钮更宽
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  scoreDisplay: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  puzzle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  letter: {
    padding: 15,
    backgroundColor: '#ff8c00',
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholders: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  placeholder: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0066cc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  placeholderText: {
    fontSize: 18,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  hintButton: {
    padding: 15,
    backgroundColor: '#0066cc',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  hintsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 51, 102, 0.6)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 19,
    color: '#fff',
    padding: 10,
  },
  speakerIcon: {
    marginLeft: 10,
    padding: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Game;