'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, SessionData } from '@/types/auth';
import {
  createSession,
  getCurrentUser,
  getCurrentSession,
  login as _login,
  register as _register,
  logout as _logout,
  validateToken,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';

interface AuthContextType {
  user: User | null;
  sessionData: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated: boolean = !!user;

  const isOnAuthPage = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return (
      path.includes('/login') ||
      path.includes('/register') ||
      path.includes('/unauthorized')
    );
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnAuthPage()) {
        console.log('📱 On auth page - skipping authentication check');
        setIsLoading(false);
        return;
      }

      try {
        const isValid = await validateToken();
        if (isValid.success) {
          const userData = await getCurrentUser();
          if (userData.success) {
            setUser(userData.data.user);
          }
        }
      } catch (err) {
        Logger.error(err);
      }

      try {
        const sessionResponse = await getCurrentSession();
        if (sessionResponse.success) {
          setSessionData(sessionResponse.data.data);
        }
      } catch (err) {
        // no session
        try {
          const newSession = await createSession();
          if (newSession.success) {
            setSessionData(newSession.data.data);
          }
        } catch (sessionErr) {
          Logger.error('Failed to create session:', sessionErr);
          setError('Failed to initialize session');
        }
      }
    } catch (err: any) {
      Logger.error('Auth initialization failed:', err);
      setError('Authentication initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await _login(email, password);

      if (response.success) {
        setUser(response.data.user);

        // update session after login
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) {
            setSessionData(sessionResponse.data.data);
          }
        } catch (err) {
          Logger.warn('Failed to update session after login:', err);
        }
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Login failed');
      Logger.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await _register(email, password, firstName, lastName);

      if (response.success) {
        setUser(response.data.user);

        // update session after registration
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) {
            setSessionData(sessionResponse.data.data);
          }
        } catch (err) {
          Logger.warn('Failed to update session after registration:', err);
        }
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      setError('Registration failed');
      Logger.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await _logout();
    } catch (err) {
      Logger.error('Logout request failed:', err);
    }

    setUser(null);
    setSessionData(null);
    setError(null);
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    sessionData,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError,
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
