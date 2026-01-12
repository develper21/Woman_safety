import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS, SIZES} from '@constants/index';
import {AuthStackParamList} from '@navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      setTimeout(() => {
        setShowOTP(true);
        setIsLoading(false);
        Alert.alert('Success', 'OTP sent to your phone number');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate login
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Login successful');
        navigation.replace('Main');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to access your safety features
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1234567890"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!showOTP}
              />
            </View>

            {showOTP && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={showOTP ? handleLogin : handleSendOTP}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : showOTP ? 'Login' : 'Send OTP'}
              </Text>
            </TouchableOpacity>

            {!showOTP && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleRegister}>
                <Text style={styles.linkText}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xl,
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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textLight,
    borderRadius: SIZES.radiusBase,
    padding: SIZES.base,
    fontSize: SIZES.base,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusBase,
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: SIZES.lg,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: SIZES.sm,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.xl2,
  },
  footerText: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LoginScreen;
