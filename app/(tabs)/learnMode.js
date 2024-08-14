import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getCards } from '../../services/db';
import Flashcard from '../../components/Flashcard';
import { scheduleNotification } from '../../services/NotificationService';

export default function LearnMode() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswersQA, setCorrectAnswersQA] = useState(0);
  const [correctAnswersCards, setCorrectAnswersCards] = useState(0);
  const [modeSelected, setModeSelected] = useState(false); // Track if mode has been selected
  const [showCardsMode, setShowCardsMode] = useState(false); // Default to question and answer mode
  const [userAnswer, setUserAnswer] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
  const isFocused = useIsFocused();
  const route = useRoute();
  const setId = route.params?.setId;

  const fetchFlashcards = useCallback(async () => {
    try {
      const cards = await getCards(setId);
      setFlashcards(cards);
      setCurrentIndex(0);
      setCorrectAnswersQA(0); // Reset correctAnswersQA when fetching new flashcards
      setCorrectAnswersCards(0); // Reset correctAnswersCards when fetching new flashcards
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  }, [setId]);

  useEffect(() => {
    if (isFocused && modeSelected) {
      fetchFlashcards();
      scheduleReminderNotification();
    }
  }, [isFocused, fetchFlashcards, modeSelected]);

  const handleNextCard = (swipeDirection) => {
    if (showCardsMode && swipeDirection === 'right') {
      setCorrectAnswersCards((prev) => prev + 1);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleAnswerVerification = () => {
    const currentFlashcard = flashcards[currentIndex];
    if (userAnswer.toLowerCase() === currentFlashcard.answer.toLowerCase()) {
      // Correct answer
      if (!showCardsMode) {
        setCorrectAnswersQA((prev) => prev + 1);
      }
      Animated.timing(backgroundColor, {
        toValue: 1, // Custom green color
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Reset background color after animation
        setTimeout(() => {
          Animated.timing(backgroundColor, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            handleNextCard('right');
            setUserAnswer(''); // Clear user answer after correct verification
          });
        }, 1000); // Wait for 1 second before resetting background color
      });
    } else {
      // Incorrect answer
      Animated.timing(backgroundColor, {
        toValue: -1, // Custom red color
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Reset background color after animation
        setTimeout(() => {
          Animated.timing(backgroundColor, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            // Show alert with correct answer
            Alert.alert(
              'Incorrect Answer',
              `The correct answer is: ${currentFlashcard.answer}`,
              [{ text: 'OK', onPress: () => handleNextCard('left') }]
            );
          });
        }, 1000); // Wait for 1 second before resetting background color
      });
    }
  };

  const scheduleReminderNotification = async () => {
    try {
      const trigger = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours after entering LearnMode
      await scheduleNotification({
        title: 'Reminder',
        body: 'Do you want to continue learning?',
        trigger: trigger,
      });
      console.log("Reminder notification scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling reminder notification:", error);
    }
  };

  const startLearning = (selectedMode) => {
    setShowCardsMode(selectedMode === 'cards');
    setModeSelected(true);
    setCorrectAnswersQA(0); // Reset correctAnswersQA
    setCorrectAnswersCards(0); // Reset correctAnswersCards
    setCurrentIndex(0); // Reset currentIndex
    setUserAnswer(''); // Reset userAnswer
    setBackgroundColor(new Animated.Value(0)); // Reset background color
  };

  const resetLearningMode = () => {
    setModeSelected(false);
    setFlashcards([]);
    setCorrectAnswersQA(0);
    setCorrectAnswersCards(0);
  };

  if (!modeSelected) {
    return (
      <View style={styles.container}>
        <Text style={styles.subTitle}>Select learning mode:</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => startLearning('cards')}>
          <Text style={styles.buttonText}>Flashcards Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={() => startLearning('qa')}>
          <Text style={styles.buttonText}>Question & Answer Mode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  const renderContent = () => {
    const currentFlashcard = flashcards[currentIndex];
    if (showCardsMode) {
      return (
        <View style={styles.cardContainer}>
          <Flashcard flashcard={currentFlashcard} onSwipe={(direction) => handleNextCard(direction)} />
          <Text style={styles.correctAnswersText}>Correct answers: {correctAnswersCards}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.questionAnswerContainer}>
          <Text style={styles.questionText}>Question: {currentFlashcard.question}</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUserAnswer}
            value={userAnswer}
            placeholder="Type your answer"
            editable={true} // Allow input in question mode
          />
          <TouchableOpacity style={styles.createButton} onPress={handleAnswerVerification}>
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
          <Text style={styles.correctAnswersText}>Correct answers: {correctAnswersQA}</Text>
        </View>
      );
    }
  };

  const backgroundColorInterpolate = backgroundColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['#FE7171', 'rgba(255,255,255,0)', '#7ECC87'],
  });

  const animatedStyle = {
    backgroundColor: backgroundColorInterpolate,
    height: '100%', // Height of the colored area (adjust as needed)
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderContent()}
      <TouchableOpacity style={styles.resetButton} onPress={resetLearningMode}>
        <Text style={styles.buttonText}>Change Learning Mode</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  correctAnswersText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 30,
    fontWeight: 'bold',
  },
  questionAnswerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth:3,
    borderColor: 'grey',
    borderRadius:25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7399c7',
    marginVertical: 5,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 24,
    marginBottom: 5,
  },
});
