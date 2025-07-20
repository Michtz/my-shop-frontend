'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, SessionData, UserInformation } from '@/types/auth';
import {
  createSession,
  getCurrentSession,
  login as _login,
  register as _register,
  logout as _logout,
  getCurrentUser,
  validateToken,
  refreshToken,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';
import { UserProfileFormData } from '@/components/section/user/UserInformationForm';

interface AuthContextType {
  userSessionData: User | undefined;
  sessionData: SessionData | undefined;
  userInformation: UserInformation | undefined;
  isLoading: boolean;

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
  const [userSessionData, setUserSessionData] = useState<User | undefined>(
    undefined,
  );
  const [userInformation, setUserInformation] = useState<UserProfileFormData>();
  const [sessionData, setSessionData] = useState<SessionData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const session = await getCurrentSession();

      const user = JSON.parse(sessionStorage.getItem('user') as any);
      if (user) {
        const test = await refreshToken();
        sessionStorage.setItem('user', JSON.stringify(test.data));
        console.log(test);
        const userInformation = await getCurrentUser();
        setUserInformation(userInformation.data.user);
      } else {
      }

      if (session.success === false) {
        const session = await createSession();
        console.log('session', session);
        setSessionData(session.data);
      } else {
        console.log('session', session);

        setSessionData(session.data);
        setUserSessionData(user);
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
        setUserSessionData(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) setSessionData(sessionResponse.data);
        } catch (err) {
          Logger.warn('Failed to update session after login:', err);
        }
      }
    } catch (err: any) {
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

    try {
      const response = await _register(email, password, firstName, lastName);

      if (response.success) {
        setUserSessionData(response.data.user);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        try {
          const sessionResponse = await getCurrentSession();
          if (sessionResponse.success) setSessionData(sessionResponse.data);
        } catch (err) {
          Logger.warn('Failed to update session after registration:', err);
        }
      }
    } catch (err: any) {
      Logger.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await _logout(sessionData?.sessionId as string);
    } catch (err) {
      Logger.error('Logout request failed:', err);
    }

    // setSessionData(undefined);
    setUserSessionData(undefined);
    setIsLoading(false);
    const session = await createSession();
    console.log('session', session);
    setSessionData(session.data);
  };

  const value: AuthContextType = {
    userInformation,
    userSessionData,
    sessionData,
    isLoading,
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
