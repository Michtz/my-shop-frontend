'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { LoginRequest, RegisterRequest, User, SessionData } from '@/types/auth';
import {
  createSession as _createSession,
  getCurrentUser,
  refreshToken,
  validateToken,
  login as _login,
  register as _register,
  getSession,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';

interface AuthContextType {
  user: User | null;
  sessionId: string;
  sessionData: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  createSession: (data?: SessionData) => Promise<void>;
  login: (data: Omit<LoginRequest, 'sessionId'>) => Promise<void>;
  register: (data: Omit<RegisterRequest, 'sessionId'>) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const SESSION_ID_KEY = 'session_id';
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(
        async () => {
          try {
            await refreshToken();
          } catch {
            await logout();
          }
        },
        14 * 60 * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedSessionId =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(SESSION_ID_KEY)
          : null;

      const isTokenValid = await validateToken();

      if (isTokenValid) {
        const userData = await getCurrentUser();
        setUser(userData.data);
      }

      if (storedSessionId) {
        try {
          const sessionResponse = await getSession(storedSessionId);
          setSessionId(sessionResponse.sessionId);
          setSessionData(sessionResponse.data);
        } catch {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(SESSION_ID_KEY);
          }
        }
      }
    } catch (err: any) {
      Logger.error('Auth initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (data?: SessionData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await _createSession();
      sessionStorage.setItem(SESSION_ID_KEY, response.sessionId);

      setSessionId(response.data.sessionId);
      setSessionData(response.data.data);
    } catch (err: any) {
      setError('Failed to create session');
      Logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: Omit<LoginRequest, 'sessionId'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentSessionId =
        sessionId || typeof window !== 'undefined'
          ? sessionStorage.getItem(SESSION_ID_KEY)
          : null;
      if (!currentSessionId) {
        Logger.error('No session available');
      }

      const response = await _login();

      // await TokenManager.setAuthTokens(
      //   response.data.token,
      //   response.data.refreshToken,
      // );

      setUser(response.data.user);
    } catch (err: any) {
      setError('Login failed');
      Logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Omit<RegisterRequest, 'sessionId'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentSessionId =
        sessionId || typeof window !== 'undefined'
          ? localStorage.getItem(SESSION_ID_KEY)
          : null;

      if (!currentSessionId) {
        Logger.error('No session available');
      }

      const response = await _register(currentSessionId as string);

      // await TokenManager.setAuthTokens(
      //   response.data.token,
      //   response.data.refreshToken,
      // );

      setUser(response.data.user);
    } catch (err: any) {
      setError('Registration failed');
      Logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await logout();
    } catch (err) {
      Logger.error('Logout request failed:', err);
    }

    // await TokenManager.clearAuthTokens();
    setUser(null);
    setError(null);
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    sessionId,
    sessionData,
    isLoading,
    isAuthenticated,
    error,
    createSession,
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
