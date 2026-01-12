import {Platform, Alert, Vibration} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {SOSData, EmergencyContact} from '../types';
import {STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const notificationService = {
  initialize: (): void => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
        // In a real app, you would send this token to your backend
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        if (notification.userInteraction) {
          // User tapped the notification
          // Handle navigation based on notification type
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create default notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'sos-emergency',
          channelName: 'SOS Emergency',
          channelDescription: 'Emergency alerts and SOS notifications',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log('SOS channel created:', created),
      );

      PushNotification.createChannel(
        {
          channelId: 'safety-awareness',
          channelName: 'Safety Awareness',
          channelDescription: 'Safety tips and awareness notifications',
          playSound: false,
          importance: 2,
          vibrate: false,
        },
        (created) => console.log('Safety channel created:', created),
      );
    }
  },

  requestNotificationPermission: async (): Promise<boolean> => {
    try {
      const result = await PushNotification.requestPermissions();
      return result || false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  sendEmergencyAlert: async (sosData: SOSData): Promise<void> => {
    try {
      // Get emergency contacts
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      const contacts: EmergencyContact[] = contactsData ? JSON.parse(contactsData) : [];

      // Send local notification
      PushNotification.localNotification({
        channelId: 'sos-emergency',
        title: '🆘 SOS ACTIVATED',
        message: 'Emergency alert sent to your contacts',
        actions: ['Cancel SOS', 'View Location'],
        userInfo: {sosId: sosData.id, type: 'sos_active'},
      });

      // Vibrate for emergency
      Vibration.vibrate([0, 500, 200, 500]);

      // In a real app, you would send push notifications to emergency contacts
      for (const contact of contacts) {
        console.log(`Emergency alert sent to ${contact.name} (${contact.phone})`);
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  },

  sendSOSDeactivationNotice: async (): Promise<void> => {
    try {
      PushNotification.localNotification({
        channelId: 'sos-emergency',
        title: '✅ SOS Deactivated',
        message: 'Emergency situation has been resolved',
        userInfo: {type: 'sos_deactivated'},
      });
    } catch (error) {
      console.error('Error sending SOS deactivation notice:', error);
    }
  },

  sendSafetyAwarenessNotification: (title: string, message: string): void => {
    try {
      PushNotification.localNotification({
        channelId: 'safety-awareness',
        title: title,
        message: message,
        userInfo: {type: 'safety_awareness'},
      });
    } catch (error) {
      console.error('Error sending safety awareness notification:', error);
    }
  },

  sendTestAlert: async (): Promise<void> => {
    try {
      PushNotification.localNotification({
        channelId: 'sos-emergency',
        title: '🧪 SOS Test',
        message: 'This is a test of the emergency alert system',
        userInfo: {type: 'sos_test'},
      });

      Alert.alert(
        'SOS Test',
        'This is a test. In an emergency, your contacts would be notified immediately.',
        [{text: 'OK', style: 'default'}],
      );
    } catch (error) {
      console.error('Error sending test alert:', error);
    }
  },

  sendLocationUpdateNotification: (locationText: string): void => {
    try {
      PushNotification.localNotification({
        channelId: 'sos-emergency',
        title: '📍 Location Updated',
        message: locationText,
        userInfo: {type: 'location_update'},
      });
    } catch (error) {
      console.error('Error sending location update notification:', error);
    }
  },

  sendEmergencyTimerNotification: (minutes: number): void => {
    try {
      PushNotification.localNotification({
        channelId: 'sos-emergency',
        title: '⏰ Emergency Timer Set',
        message: `SOS will activate in ${minutes} minutes if not cancelled`,
        userInfo: {type: 'emergency_timer', minutes},
      });
    } catch (error) {
      console.error('Error sending emergency timer notification:', error);
    }
  },

  cancelAllNotifications: (): void => {
    try {
      PushNotification.cancelAllLocalNotifications();
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  },

  getScheduledNotifications: (): Promise<any[]> => {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications: any) => {
        resolve(notifications);
      });
    });
  },

  cancelNotification: (id: string): void => {
    try {
      PushNotification.cancelLocalNotifications({id});
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  },

  // Check if notifications are enabled
  areNotificationsEnabled: async (): Promise<boolean> => {
    try {
      const result = await PushNotification.checkPermissions();
      return result.alert || result.badge || result.sound;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  },

  // Get application badge count
  getApplicationIconBadgeNumber: (): Promise<number> => {
    return new Promise((resolve) => {
      PushNotification.getApplicationIconBadgeNumber((badgeNumber: number) => {
        resolve(badgeNumber);
      });
    });
  },

  // Set application badge count
  setApplicationIconBadgeNumber: (number: number): void => {
    try {
      PushNotification.setApplicationIconBadgeNumber(number);
    } catch (error) {
      console.error('Error setting badge number:', error);
    }
  },
};
