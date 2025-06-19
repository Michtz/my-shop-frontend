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
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

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
    console.log('initializeAuth');
    console.log(JSON.stringify(sessionStorage.getItem('data')));
  }, []);

  const initializeAuth = async () => {
    console.log(JSON.stringify(sessionStorage.getItem('data')));
    setIsLoading(true);
    setError(null);
    try {
      // if (!isOnAuthPage()) {
      //   console.log('📱 On auth page - skipping authentication check');
      //   setIsLoading(false);
      //   return;
      // }

      try {
        const session = await getCurrentSession();
        const auth = await getCurrentSession();
        console.log(session);
        const user = JSON.parse(sessionStorage.getItem('user')!);
        console.log(user);
        if (session.success === false) {
          const session = await createSession();
          console.log('session create', session);
          setSessionData(session.data);
        } else {
          console.log('session get', session);
          setSessionData(session.data);
          setUser(user as User);
        }

        // if (session.data.sessionId) {
        //   const userData = await getCurrentUser();
        //   if (userData.success) {
        //     setUser(userData.data.user);
        //   }
        // }
      } catch (err) {
        Logger.error('Auth initialization failed:', err);
        setError('Authentication initialization failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await _login(email, password);
      console.log(response);
      if (response.success) {
        setUser(response.data.user);

        // update session after login
        try {
          console.log('in hereee2');
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) {
            setSessionData(sessionResponse);
            console.log(response.data);
            sessionStorage.setItem('user', JSON.stringify(response.data));
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
          console.log('in hereee 3');
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
