import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, PanResponder } from 'react-native';

export default function Flashcard({ flashcard, onSwipe }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const flipToFront = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAnswer(false));
  };

  const flipToBack = () => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAnswer(true));
  };

  const handleFlip = () => {
    if (showAnswer) {
      flipToFront();
    } else {
      flipToBack();
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 100) {
        onSwipe('right');
      } else if (gestureState.dx < -100) {
        onSwipe('left');
      }
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    },
  });

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const backgroundColorInterpolate = pan.x.interpolate({
    inputRange: [-400, 0, 400],
    outputRange: ['red', 'lightblue', 'green'],
  });

  const frontOpacityInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 1],
  });

  const backOpacityInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotateY: flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
          ],
          backgroundColor: backgroundColorInterpolate,
        },
      ]}
    >
      <TouchableOpacity style={styles.cardTouchable} onPress={handleFlip}>
        <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacityInterpolate }]}>
          <Text style={styles.text}>{flashcard.question}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }], opacity: backOpacityInterpolate }]}>
          <Text style={[styles.text, { transform: [{ scaleX: -1 }] }]}>{flashcard.answer}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '80%',
    height: '60%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6A898B',
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: {
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
});
