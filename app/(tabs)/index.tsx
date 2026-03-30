import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [isHolding, setIsHolding] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const vibrationTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardLift = useRef(new Animated.Value(14)).current;

  const stopVibration = () => {
    if (vibrationTimer.current) {
      clearInterval(vibrationTimer.current);
      vibrationTimer.current = null;
    }
    Vibration.cancel();
  };

  const handlePressIn = () => {
    setIsHolding(true);
    setIsCardVisible(false);

    cardOpacity.setValue(0);
    cardLift.setValue(14);

    Vibration.vibrate(18);
    vibrationTimer.current = setInterval(() => {
      Vibration.vibrate(18);
    }, 350);
  };

  const handlePressOut = () => {
    setIsHolding(false);
    stopVibration();
    setIsCardVisible(true);

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(cardLift, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  };


  useEffect(() => {
    return () => {
      stopVibration();
    };
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.button,
            (pressed || isHolding) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Hold</Text>
        </Pressable>

        {isCardVisible ? (
          <Animated.View
            style={[
              styles.card,
              { opacity: cardOpacity, transform: [{ translateY: cardLift }] },
            ]}
          >
            <Text style={styles.label}>Compliment</Text>
            <Text style={styles.value}>You bring calm energy to this moment.</Text>

            <Text style={styles.label}>Interesting fact</Text>
            <Text style={styles.value}>A short, gentle pause can improve focus.</Text>

            <Text style={styles.label}>Mindful task</Text>
            <Text style={styles.value}>Take three slow breaths and soften your shoulders.</Text>
          </Animated.View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 22,
  },
  button: {
    minWidth: 150,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 999,
    backgroundColor: '#4B6BFB',
    alignItems: 'center',
    shadowColor: '#4B6BFB',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#405DE0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 8,
    shadowColor: '#1D2440',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#7A8198',
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1D2440',
  },
});
