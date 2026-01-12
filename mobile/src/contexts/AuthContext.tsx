import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, AuthState, ApiResponse} from '@types/index';
import {authService} from '@services/authService';
import {STORAGE_KEYS} from '@constants/index';

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<ApiResponse<{user: User; token: string}>>;
  register: (userData: {name: string; phone: string; email?: string}) => Promise<ApiResponse<{user: User; token: string}>>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_USER'; payload: {user: User; token: string}}
  | {type: 'CLEAR_USER'}
  | {type: 'UPDATE_USER'; payload: Partial<User>};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? {...state.user, ...action.payload} : null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({type: 'SET_USER', payload: {user, token}});
      } else {
        dispatch({type: 'SET_LOADING', payload: false});
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const login = async (phone: string, otp: string): Promise<ApiResponse<{user: User; token: string}>> => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      
      const response = await authService.login(phone, otp);
      
      if (response.success && response.data) {
        const {user, token} = response.data;
        
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        dispatch({type: 'SET_USER', payload: {user, token}});
        
        return {success: true, data: {user, token}};
      } else {
        dispatch({type: 'SET_LOADING', payload: false});
        return {success: false, error: response.error || 'Login failed'};
      }
    } catch (error) {
      dispatch({type: 'SET_LOADING', payload: false});
      return {success: false, error: 'Network error occurred'};
    }
  };

  const register = async (userData: {
    name: string;
    phone: string;
    email?: string;
  }): Promise<ApiResponse<{user: User; token: string}>> => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        const {user, token} = response.data;
        
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        dispatch({type: 'SET_USER', payload: {user, token}});
        
        return {success: true, data: {user, token}};
      } else {
        dispatch({type: 'SET_LOADING', payload: false});
        return {success: false, error: response.error || 'Registration failed'};
      }
    } catch (error) {
      dispatch({type: 'SET_LOADING', payload: false});
      return {success: false, error: 'Network error occurred'};
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      dispatch({type: 'CLEAR_USER'});
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      
      if (response.success && response.data) {
        const {token} = response.data;
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await authService.updateProfile(userData);
      
      if (response.success && response.data) {
        const updatedUser = response.data;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        dispatch({type: 'UPDATE_USER', payload: updatedUser});
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
