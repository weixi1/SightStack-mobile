import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Importing useRouter from expo-router
import Popup from './popup'; // You need to implement a React Native version of Popup component

interface Word {
  word: string;
  hint: string;
  level: string;
}

interface GameProps {
  type: 'daily' | 'grade';
  grade?: string;
}

const wordLibrary: Word[] = [
  { word: "and", hint: "Used to connect words or phrases", level: "prek" },
  { word: "away", hint: "At a distance from a place or person", level: "prek" },
  { word: "big", hint: "Large in size", level: "prek" },
  { word: "cat", hint: "A small domesticated carnivorous mammal", level: "prek" },
  { word: "dog", hint: "A domesticated carnivorous mammal, often kept as a pet", level: "prek" },
  { word: "sun", hint: "The star at the center of our solar system", level: "prek" },
  { word: "book", hint: "A set of written, printed, or blank pages", level: "prek" },
  { word: "tree", hint: "A woody perennial plant, typically having a single stem or trunk", level: "prek" },
  { word: "fish", hint: "A limbless cold-blooded vertebrate animal with gills", level: "prek" },
  { word: "moon", hint: "The natural satellite of the Earth", level: "prek" },
  { word: "star", hint: "A luminous point in the night sky", level: "prek" },
  { word: "ball", hint: "A spherical object used in games and sports", level: "prek" },
  { word: "bird", hint: "A warm-blooded egg-laying vertebrate animal with wings", level: "prek" },
  { word: "school", hint: "A place where children go to learn", level: "2nd grade" },
  { word: "family", hint: "A group of people related by blood or marriage", level: "2nd grade" },
  { word: "friend", hint: "A person you like and trust", level: "2nd grade" },
  { word: "water", hint: "A clear liquid that all living things need to survive", level: "2nd grade" },
  { word: "happy", hint: "Feeling or showing pleasure or joy", level: "2nd grade" },
  { word: "light", hint: "Something that makes things visible or bright", level: "2nd grade" },
  { word: "apple", hint: "A round fruit that is red, green, or yellow", level: "2nd grade" },
  { word: "paper", hint: "Material used for writing or drawing on", level: "2nd grade" },
  { word: "plant", hint: "A living thing that grows in soil and has leaves and roots", level: "2nd grade" },
  { word: "house", hint: "A building where people live", level: "2nd grade" },
  { word: "tiger", hint: "A large wild cat with orange fur and black stripes", level: "2nd grade" },
  { word: "clock", hint: "A device that shows the time", level: "2nd grade" },
  { word: "music", hint: "Sounds that are sung or played and that people enjoy", level: "2nd grade" }
];

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
    default: return 'prek';
  }
};

const Game: React.FC<GameProps> = ({ type, grade }) => {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [shuffledWord, setShuffledWord] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = async () => {
    try {
      let randomWord: Word;
      if (type === 'daily') {
        randomWord = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
      } else if (grade) {
        const level = gradeToLevel(grade);
        randomWord = wordLibrary.filter(word => word.level === level)[Math.floor(Math.random() * wordLibrary.filter(word => word.level === level).length)];
      } else {
        throw new Error('Grade level is required for grade-specific games');
      }
      setCurrentWord(randomWord);
      const shuffled = shuffleArray(randomWord.word.split(''));
      setShuffledWord(shuffled);
      setAnswer(Array(shuffled.length).fill(''));
      setShowHint(false);
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleReplay = () => {
    setAnswer(Array(answer.length).fill(''));
  };

  const handleSubmit = async () => {
    if (currentWord && answer.join('') === currentWord.word) {
      setScore(score + 1);
      setIsCompleted(true);
      setPopupMessage('Correct!');
      setIsPopupOpen(true);
      setTimeout(() => {
        startGame();
        setIsPopupOpen(false);
      }, 2000);
    } else {
      setPopupMessage('Try again!');
      setIsPopupOpen(true);
      setTimeout(() => {
        handleReplay();
        setIsPopupOpen(false);
      }, 2000);
    }
  };

  const goBackToHome = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={startGame} style={styles.button}>
          <Text>{isCompleted ? 'New Game' : 'Play'}</Text>
        </TouchableOpacity>
        <View style={styles.scoreDisplay}>
          <Text>Score: {score}</Text>
        </View>
        <TouchableOpacity onPress={goBackToHome} style={styles.button}>
          <Text>Exit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.mainArea}>
        {currentWord && (
          <>
            <View style={styles.puzzle}>
              {shuffledWord.map((letter, index) => (
                <TouchableOpacity key={index} style={styles.draggable}>
                  <Text>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.placeholders}>
              {answer.map((letter, index) => (
                <TouchableOpacity key={index} style={styles.placeholder}>
                  <Text>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowHint(!showHint)} style={styles.button}>
              <Text>{showHint ? 'Hide Hint' : 'Show Hint'}</Text>
            </TouchableOpacity>
            {showHint && (
              <View style={styles.hintsSection}>
                <Text>Hint: {currentWord.hint}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleReplay} style={styles.button}>
          <Text>Replay</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text>Submit</Text>
        </TouchableOpacity>
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} message={popupMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
    alignItems: 'center',
  },
  scoreDisplay: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
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
  },
  draggable: {
    padding: 15,
    backgroundColor: '#ff8c00',
    borderRadius: 10,
    margin: 5,
  },
  placeholders: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
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
  hintsSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Game;
