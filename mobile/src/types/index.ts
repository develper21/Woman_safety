export interface User {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  emergencyContacts: EmergencyContact[];
  permissions: UserPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  userId: string;
}

export interface UserPermissions {
  location: PermissionStatus;
  microphone: PermissionStatus;
  motion: PermissionStatus;
  notifications: PermissionStatus;
  backgroundLocation: PermissionStatus;
}

export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'not_determined';

export interface SOSData {
  id: string;
  userId: string;
  location?: LocationData;
  timestamp: string;
  isActive: boolean;
  triggerType: 'manual' | 'voice' | 'timer' | 'auto';
  contactsNotified: string[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string;
}

export interface RiskAwareness {
  level: 'low' | 'medium' | 'high';
  message: string;
  factors: RiskFactor[];
  timestamp: string;
}

export interface RiskFactor {
  type: 'time' | 'location' | 'movement' | 'battery';
  value: string;
  impact: 'low' | 'medium' | 'high';
}

export interface IncidentLog {
  id: string;
  userId: string;
  type: 'text' | 'voice' | 'location';
  content: string;
  location?: LocationData;
  timestamp: string;
  isDeleted: boolean;
}

export interface FakeCallConfig {
  id: string;
  callerName: string;
  phoneNumber: string;
  delay: number;
  isActive: boolean;
}

export interface VoiceTrigger {
  phrase: string;
  isActive: boolean;
  confidence: number;
}

export interface EmergencyTimer {
  id: string;
  duration: number;
  startTime?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SOSState {
  isActive: boolean;
  currentSOS: SOSData | null;
  location: LocationData | null;
  isTrackingLocation: boolean;
}

export interface PermissionState {
  permissions: UserPermissions;
  isRequesting: boolean;
  hasCompletedOnboarding: boolean;
}
