import {Linking, Alert} from 'react-native';
import {SOSData, LocationData, EmergencyContact, ApiResponse} from '../types';
import {API_ENDPOINTS, STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from './authService';

export const sosService = {
  activateSOS: async (sosData: SOSData): Promise<ApiResponse<SOSData>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SOS.ACTIVATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sosData),
      });

      if (!response.ok) {
        throw new Error('Failed to activate SOS');
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'SOS activation failed',
      };
    }
  },

  deactivateSOS: async (sosId: string): Promise<ApiResponse<{message: string}>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SOS.DEACTIVATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({sosId}),
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate SOS');
      }

      return {
        success: true,
        data: {message: 'SOS deactivated successfully'},
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'SOS deactivation failed',
      };
    }
  },

  updateSOSLocation: async (sosId: string, location: LocationData): Promise<void> => {
    try {
      await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SOS.LOCATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({sosId, location}),
      });
    } catch (error) {
      console.error('Error updating SOS location:', error);
    }
  },

  makeEmergencyCall: async (): Promise<void> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      if (contactsData) {
        const contacts: EmergencyContact[] = JSON.parse(contactsData);
        const primaryContact = contacts.find(contact => contact.isPrimary);
        
        if (primaryContact) {
          const phoneUrl = `tel:${primaryContact.phone}`;
          const supported = await Linking.canOpenURL(phoneUrl);
          
          if (supported) {
            await Linking.openURL(phoneUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
    }
  },

  sendLocationSMS: async (location: LocationData): Promise<void> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      if (contactsData) {
        const contacts: EmergencyContact[] = JSON.parse(contactsData);
        const message = `EMERGENCY: I need help! My location is: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
        
        for (const contact of contacts) {
          // In a real app, you would use a SMS service
          console.log(`Sending SMS to ${contact.phone}: ${message}`);
        }
      }
    } catch (error) {
      console.error('Error sending location SMS:', error);
    }
  },

  addEmergencyContact: async (contact: EmergencyContact): Promise<ApiResponse<EmergencyContact>> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      let contacts: EmergencyContact[] = contactsData ? JSON.parse(contactsData) : [];
      
      // If this is the first contact, make it primary
      if (contacts.length === 0) {
        contact.isPrimary = true;
      }
      
      // If this contact is set as primary, remove primary from others
      if (contact.isPrimary) {
        contacts = contacts.map(c => ({...c, isPrimary: false}));
      }
      
      contacts.push(contact);
      
      await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
      
      return {
        success: true,
        data: contact,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add emergency contact',
      };
    }
  },

  removeEmergencyContact: async (contactId: string): Promise<ApiResponse<{message: string}>> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      let contacts: EmergencyContact[] = contactsData ? JSON.parse(contactsData) : [];
      
      contacts = contacts.filter(contact => contact.id !== contactId);
      
      // If we removed the primary contact and there are others, make the first one primary
      if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
        contacts[0].isPrimary = true;
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
      
      return {
        success: true,
        data: {message: 'Emergency contact removed successfully'},
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to remove emergency contact',
      };
    }
  },

  updateEmergencyContact: async (contactId: string, updates: Partial<EmergencyContact>): Promise<ApiResponse<EmergencyContact>> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      let contacts: EmergencyContact[] = contactsData ? JSON.parse(contactsData) : [];
      
      const contactIndex = contacts.findIndex(contact => contact.id === contactId);
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      
      // If this contact is being set as primary, remove primary from others
      if (updates.isPrimary) {
        contacts = contacts.map(c => ({...c, isPrimary: false}));
      }
      
      contacts[contactIndex] = {...contacts[contactIndex], ...updates};
      
      await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
      
      return {
        success: true,
        data: contacts[contactIndex],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update emergency contact',
      };
    }
  },

  getEmergencyContacts: async (): Promise<ApiResponse<EmergencyContact[]>> => {
    try {
      const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      const contacts: EmergencyContact[] = contactsData ? JSON.parse(contactsData) : [];
      
      return {
        success: true,
        data: contacts,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get emergency contacts',
      };
    }
  },

  testSOSFunctionality: async (): Promise<ApiResponse<{message: string}>> => {
    try {
      Alert.alert(
        'SOS Test',
        'This is a test of the SOS system. In an emergency, your contacts would be notified and your location would be shared.',
        [{text: 'OK', style: 'default'}],
      );
      
      return {
        success: true,
        data: {message: 'SOS test completed successfully'},
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'SOS test failed',
      };
    }
  },
};
