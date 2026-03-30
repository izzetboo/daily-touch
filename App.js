import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

const compliments = [
  'You bring calm energy wherever you go.',
  'Your focus is stronger than you think.',
  'You have a quietly powerful presence.',
];

const facts = [
  'A slow exhale can help your heart rate settle.',
  'Your brain uses pauses to reset attention.',
  'Even 30 seconds of stillness can reduce stress signals.',
];

const mindfulTasks = [
  'Take 3 slow breaths and relax your shoulders.',
  'Notice 3 sounds around you right now.',
  'Place a hand on your chest for 10 seconds and breathe softly.',
];

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

export default function App() {
  const [result, setResult] = useState(null);
  const [isHolding, setIsHolding] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.96)).current;

  const vibrationTimerRef = useRef(null);
  const vibrationStepRef = useRef(0);

  const gradientColors = useMemo(
    () => ['#f6f7ff', '#efe6ff', '#e6f8ff'],
    []
  );

  const startHoldAnimation = () => {
    Animated.spring(buttonScale, {
      toValue: 1.08,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  };

  const stopHoldAnimation = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  };

  const showCard = () => {
    cardOpacity.setValue(0);
    cardScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startGradualVibration = () => {
    vibrationStepRef.current = 0;

    vibrationTimerRef.current = setInterval(() => {
      const step = vibrationStepRef.current;

      const pulseLength = Math.min(500, 90 + step * 28);
      Vibration.vibrate(pulseLength);

      vibrationStepRef.current += 1;
    }, 230);
  };

  const stopGradualVibration = () => {
    if (vibrationTimerRef.current) {
      clearInterval(vibrationTimerRef.current);
      vibrationTimerRef.current = null;
    }
    Vibration.cancel();
  };


  useEffect(() => {
    return () => {
      stopGradualVibration();
    };
  }, []);
  const onHoldStart = () => {
    setIsHolding(true);
    setResult(null);
    startHoldAnimation();
    startGradualVibration();
  };

  const onHoldEnd = () => {
    if (!isHolding) return;

    setIsHolding(false);
    stopHoldAnimation();
    stopGradualVibration();

    setResult({
      compliment: pickRandom(compliments),
      fact: pickRandom(facts),
      task: pickRandom(mindfulTasks),
    });

    showCard();
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View
        pointerEvents="none"
        style={[
          styles.gradient,
          { backgroundColor: gradientColors[0] },
        ]}
      />
      <View pointerEvents="none" style={[styles.blob, styles.blobOne]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobTwo]} />

      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.holdButton,
              pressed && styles.holdButtonPressed,
            ]}
            onPressIn={onHoldStart}
            onPressOut={onHoldEnd}
          >
            <Text style={styles.buttonText}>Hold</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          {result ? (
            <>
              <Text style={styles.sectionTitle}>Compliment</Text>
              <Text style={styles.sectionBody}>{result.compliment}</Text>

              <Text style={styles.sectionTitle}>Interesting fact</Text>
              <Text style={styles.sectionBody}>{result.fact}</Text>

              <Text style={styles.sectionTitle}>Mindful task</Text>
              <Text style={styles.sectionBody}>{result.task}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>
              Press and hold to receive a mindful prompt.
            </Text>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f6f7ff',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.35,
  },
  blobOne: {
    top: -60,
    left: -70,
    backgroundColor: '#d9c5ff',
  },
  blobTwo: {
    bottom: -80,
    right: -90,
    backgroundColor: '#bfe8ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 26,
  },
  holdButton: {
    width: 132,
    height: 132,
    borderRadius: 66,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#8f8ca6',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  holdButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c2f40',
    letterSpacing: 0.2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 22,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: '#7d79a3',
    shadowOpacity: 0.11,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  placeholderText: {
    fontSize: 15,
    color: '#4f5368',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 4,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#6e7091',
    fontWeight: '700',
  },
  sectionBody: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 23,
    color: '#2f3242',
  },
});
