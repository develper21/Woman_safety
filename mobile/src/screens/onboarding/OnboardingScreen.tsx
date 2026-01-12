import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS, SIZES} from '@constants/index';
import {AuthStackParamList} from '@navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Welcome to PPDU',
      subtitle: 'Your Personal Safety Companion',
      description: 'PPDU is designed to keep you safe with emergency alerts, location tracking, and quick access to help when you need it most.',
      image: require('@assets/images/onboarding-welcome.png'),
    },
    {
      title: 'Emergency Contacts',
      subtitle: 'Your Safety Network',
      description: 'Add 1-5 trusted contacts who will be notified immediately when you trigger an SOS alert.',
      image: require('@assets/images/onboarding-contacts.png'),
    },
    {
      title: 'Smart Permissions',
      subtitle: 'Your Privacy Matters',
      description: 'We only request permissions that are essential for your safety. Each permission is explained clearly and you can choose what to enable.',
      image: require('@assets/images/onboarding-permissions.png'),
    },
    {
      title: 'One-Tap SOS',
      subtitle: 'Instant Help',
      description: 'Activate emergency alerts with a single tap. Your location and emergency contacts will be notified immediately.',
      image: require('@assets/images/onboarding-sos.png'),
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('Permissions');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Permissions');
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPageData = pages[currentPage];

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentPage && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageEmoji}>
                {currentPage === 0 && '🛡️'}
                {currentPage === 1 && '👥'}
                {currentPage === 2 && '🔒'}
                {currentPage === 3 && '🆘'}
              </Text>
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentPageData.title}</Text>
            <Text style={styles.subtitle}>{currentPageData.subtitle}</Text>
            <Text style={styles.description}>
              {currentPageData.description}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {currentPage > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handlePrevious}>
              <Text style={styles.buttonTextSecondary}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Onboarding</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SIZES.xl,
    gap: SIZES.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SIZES.xl2,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  imageContainer: {
    marginBottom: SIZES.xl2,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  imageEmoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl2,
  },
  title: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.lg,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
    minWidth: 120,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: COLORS.primary,
    fontSize: SIZES.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  skipButtonText: {
    color: COLORS.textLight,
    fontSize: SIZES.sm,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
