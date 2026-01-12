import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import {COLORS, SIZES} from '@constants/index';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainTabParamList} from '@navigation/AppNavigator';

type EmergencyTimerNavigationProp = NativeStackNavigationProp<MainTabParamList, 'EmergencyTimer'>;

const EmergencyTimerScreen = () => {
  const navigation = useNavigation<EmergencyTimerNavigationProp>();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [initialTime, setInitialTime] = useState(30); // 30 seconds default

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, countdown]);

  const handleStartTimer = () => {
    Vibration.vibrate([100, 100, 100]);
    setIsTimerActive(true);
    setCountdown(initialTime);
  };

  const handleStopTimer = () => {
    Vibration.vibrate(200);
    setIsTimerActive(false);
    setCountdown(0);
  };

  const handleTimerComplete = () => {
    Vibration.vibrate([200, 200, 500, 500]);
    setIsTimerActive(false);
    
    Alert.alert(
      'Timer Completed!',
      'Emergency alert has been triggered because the timer was not cancelled.',
      [
        {
          text: 'OK',
          onPress: () => {
            // In real app, would trigger SOS
            navigation.navigate('SOS');
          },
        },
      ],
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    const progress = (initialTime - countdown) / initialTime;
    if (progress > 0.66) return COLORS.success;
    if (progress > 0.33) return COLORS.warning;
    return COLORS.error;
  };

  const getProgressWidth = () => {
    const progress = (initialTime - countdown) / initialTime;
    return `${(progress * 100)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Timer</Text>
        <Text style={styles.subtitle}>
          Automatic SOS if you don\'t cancel in time
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timerCard}>
          <View style={styles.timerDisplay}>
            <Text style={[
              styles.timerText,
              countdown <= 10 && styles.timerTextUrgent,
            ]}>
              {formatTime(countdown)}
            </Text>
            
            {isTimerActive && (
              <View style={styles.progressRing}>
                <View style={[
                  styles.progressCircle,
                  {borderColor: getProgressColor()},
                ]} />
                <Text style={styles.progressText}>{getProgressWidth()}</Text>
              </View>
            )}
          </View>

          <Text style={styles.timerStatus}>
            {!isTimerActive && countdown === 0 && 'Timer Ready'}
            {isTimerActive && countdown > 0 && 'Timer Active'}
            {!isTimerActive && countdown > 0 && 'Timer Stopped'}
          </Text>
          </View>

          <View style={styles.controls}>
            <View style={styles.timeSetup}>
              <Text style={styles.setupLabel}>Set Timer (seconds)</Text>
              <View style={styles.timeButtons}>
                {[15, 30, 60, 120].map(seconds => (
                  <TouchableOpacity
                    key={seconds}
                    style={[
                      styles.timeButton,
                      initialTime === seconds && styles.timeButtonActive,
                    ]}
                    onPress={() => setInitialTime(seconds)}>
                    <Text style={[
                      styles.timeButtonText,
                      initialTime === seconds && styles.timeButtonTextActive,
                    ]}>
                      {seconds}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  styles.startButton,
                  isTimerActive && styles.controlButtonDisabled,
                ]}
                onPress={handleStartTimer}
                disabled={isTimerActive}>
                <Text style={styles.controlButtonText}>Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  styles.stopButton,
                  !isTimerActive && styles.controlButtonDisabled,
                ]}
                onPress={handleStopTimer}
                disabled={!isTimerActive}>
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            1. Set your desired timer duration
          </Text>
          <Text style={styles.infoText}>
            2. Start the timer when entering a potentially unsafe situation
          </Text>
          <Text style={styles.infoText}>
            3. If you don\'t cancel before time runs out, SOS is automatically triggered
          </Text>
          <Text style={styles.infoText}>
            4. Perfect for walks, meetings, or when you feel uncomfortable
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>🔙 Back to Safety</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xl2,
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: SIZES.lg,
  },
  timerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  timerText: {
    fontSize: SIZES.xl4,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timerTextUrgent: {
    color: COLORS.error,
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{rotate: '-90deg'}],
  },
  progressText: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timerStatus: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  controls: {
    gap: SIZES.lg,
  },
  timeSetup: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  setupLabel: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.sm,
  },
  timeButton: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radiusBase,
    minWidth: 50,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeButtonText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: COLORS.surface,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  controlButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.xl2,
    borderRadius: SIZES.radiusLg,
    minWidth: 100,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  controlButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  controlButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
  },
  infoTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  infoText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SIZES.xs,
  },
  footer: {
    padding: SIZES.lg,
    paddingTop: SIZES.base,
  },
  backButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.textLight,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
});

export default EmergencyTimerScreen;
