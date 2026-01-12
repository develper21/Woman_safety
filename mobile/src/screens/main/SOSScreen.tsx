import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Linking,
} from 'react-native';
import {useSOS} from '@contexts/SOSContext';
import {useAuth} from '@contexts/AuthContext';
import {COLORS, SIZES} from '@constants/index';

const SOSScreen = () => {
  const {activateSOS, deactivateSOS, isActive, currentSOS} = useSOS();
  const {user} = useAuth();
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountingDown(false);
            handleSOSActivation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const handleSOSPress = () => {
    if (isActive) {
      handleSOSDeactivation();
    } else {
      startCountdown();
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    setIsCountingDown(true);
    Vibration.vibrate(100);
  };

  const handleSOSActivation = async () => {
    try {
      await activateSOS('manual');
      Vibration.vibrate([500, 200, 500]);
    } catch (error) {
      Alert.alert('Error', 'Failed to activate SOS. Please try again.');
    }
  };

  const handleSOSDeactivation = async () => {
    Alert.alert(
      'Deactivate SOS',
      'Are you sure you want to deactivate the emergency alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await deactivateSOS();
              Vibration.vibrate(200);
            } catch (error) {
              Alert.alert('Error', 'Failed to deactivate SOS. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleEmergencyCall = async () => {
    if (user?.emergencyContacts && user.emergencyContacts.length > 0) {
      const primaryContact = user.emergencyContacts.find(contact => contact.isPrimary);
      if (primaryContact) {
        const phoneUrl = `tel:${primaryContact.phone}`;
        const supported = await Linking.canOpenURL(phoneUrl);
        if (supported) {
          await Linking.openURL(phoneUrl);
        }
      }
    }
  };

  const handleFakeCall = () => {
    // Navigate to fake call screen
    Alert.alert('Fake Call', 'This feature will be available soon.');
  };

  const handleEmergencyTimer = () => {
    // Navigate to emergency timer screen
    Alert.alert('Emergency Timer', 'This feature will be available soon.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          Tap the button below in case of emergency
        </Text>
      </View>

      <View style={styles.sosContainer}>
        <TouchableOpacity
          style={[
            styles.sosButton,
            isActive ? styles.sosButtonActive : styles.sosButtonInactive,
            isCountingDown && styles.sosButtonCountdown,
          ]}
          onPress={handleSOSPress}
          activeOpacity={0.8}>
          <Text style={[
            styles.sosButtonText,
            isActive && styles.sosButtonTextActive,
          ]}>
            {isCountingDown 
              ? countdown.toString() 
              : isActive 
                ? 'SOS ACTIVE' 
                : 'SOS'
            }
          </Text>
        </TouchableOpacity>

        {isCountingDown && (
          <Text style={styles.countdownText}>
            Releasing in {countdown}...
          </Text>
        )}

        {isActive && (
          <View style={styles.activeStatus}>
            <Text style={styles.activeStatusText}>
              🆘 Emergency Alert Active
            </Text>
            <Text style={styles.activeSubText}>
              Notifying your emergency contacts...
            </Text>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEmergencyCall}>
          <Text style={styles.actionButtonText}>📞 Call Primary Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFakeCall}>
          <Text style={styles.actionButtonText}>📱 Fake Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEmergencyTimer}>
          <Text style={styles.actionButtonText}>⏰ Emergency Timer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.safetyTips}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <Text style={styles.tipText}>
          • Hold your phone securely when activating SOS
        </Text>
        <Text style={styles.tipText}>
          • Make sure your location services are enabled
        </Text>
        <Text style={styles.tipText}>
          • Keep your emergency contacts updated
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl2,
  },
  title: {
    fontSize: SIZES.xl3,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl2,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonInactive: {
    backgroundColor: COLORS.sosInactive,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  sosButtonActive: {
    backgroundColor: COLORS.sosActive,
    borderWidth: 3,
    borderColor: COLORS.error,
  },
  sosButtonCountdown: {
    backgroundColor: COLORS.warning,
  },
  sosButtonText: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sosButtonTextActive: {
    color: COLORS.surface,
  },
  countdownText: {
    fontSize: SIZES.lg,
    color: COLORS.error,
    fontWeight: '600',
    marginTop: SIZES.base,
  },
  activeStatus: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    padding: SIZES.base,
    backgroundColor: COLORS.error + '20',
    borderRadius: SIZES.radiusBase,
    width: '100%',
  },
  activeStatusText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: SIZES.xs,
  },
  activeSubText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  quickActions: {
    marginBottom: SIZES.xl2,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    padding: SIZES.base,
    borderRadius: SIZES.radiusBase,
    alignItems: 'center',
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  actionButtonText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  safetyTips: {
    backgroundColor: COLORS.surfaceVariant,
    padding: SIZES.base,
    borderRadius: SIZES.radiusBase,
  },
  tipText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
    lineHeight: 18,
  },
});

export default SOSScreen;
