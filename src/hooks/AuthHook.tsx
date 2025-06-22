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
  getCurrentSession,
  login as _login,
  register as _register,
  logout as _logout,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';

interface AuthContextType {
  user: any | null;
  sessionData: SessionData | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);
  const [sessionData, setSessionData] = useState<SessionData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const session = await getCurrentSession();
      const user = JSON.parse(sessionStorage.getItem('user')!);
      if (session.success === false) {
        const session = await createSession();
        setSessionData(session.data);
      } else {
        setSessionData(session.data);
        setUser(user as User);
      }
    } catch (err) {
      Logger.error('Auth initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await _login(email, password);
      if (response.success) {
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        setIsAuthenticated(true);
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) setSessionData(sessionResponse.data);
        } catch (err) {
          Logger.warn('Failed to update session after login:', err);
        }
      }
    } catch (err: any) {
      Logger.error('Login error:', err);
      setIsAuthenticated(false);
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

    try {
      const response = await _register(email, password, firstName, lastName);

      if (response.success) {
        setUser(response.data.user);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        setIsAuthenticated(true);
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) setSessionData(sessionResponse.data);
        } catch (err) {
          Logger.warn('Failed to update session after registration:', err);
        }
      }
      setIsAuthenticated(true);
    } catch (err: any) {
      Logger.error('Registration error:', err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await _logout(sessionData?.data.sessionId as string);
    } catch (err) {
      Logger.error('Logout request failed:', err);
    }

    setUser(null);
    setSessionData(undefined);
    setIsLoading(false);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    sessionData,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
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
