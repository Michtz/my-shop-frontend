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
  refreshToken,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';
import { UserProfileFormData } from '@/components/section/user/UserInformationForm';

interface AuthContextType {
  userSessionData: User | undefined;
  sessionData: SessionData | undefined;
  userInformation: UserInformation | undefined;
  isLoading: boolean;
  isSessionReady: boolean;

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
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting auth initialization...');
      
      // Try to get current session
      let session;
      try {
        console.log('📡 Trying to get current session...');
        const sessionResponse = await getCurrentSession();
        console.log('📡 getCurrentSession response:', sessionResponse);
        
        // Check if the response indicates success
        const sessionId = sessionResponse.data?.data?.sessionId || sessionResponse.data?.sessionId;
        if (sessionResponse.data?.success !== false && sessionId) {
          console.log('✅ Found valid existing session:', sessionId);
          session = sessionResponse;
        } else {
          console.log('❌ Session not found or invalid, will create new one');
          session = { success: false };
        }
      } catch (sessionError) {
        console.log('❌ Failed to get current session:', sessionError);
        session = { success: false };
      }

      // Handle user authentication
      const user = JSON.parse(sessionStorage.getItem('user') as any);
      if (user) {
        try {
          const test = await refreshToken();
          sessionStorage.setItem('user', JSON.stringify(test.data));
          console.log(test);
          const userInformation = await getCurrentUser();
          setUserInformation(userInformation.data.user);
          setUserSessionData(user);
        } catch (userError) {
          Logger.warn('User auth failed, continuing with guest session:', userError);
          sessionStorage.removeItem('user');
        }
      }

      // Ensure we have a session (create one if needed)
      if (session.success === false) {
        try {
          const newSession = await createSession();
          console.log('🆕 Created new session:', newSession);
          console.log('🆕 Session data structure:', newSession.data);
          
          // Check for sessionId in the nested data structure
          const sessionId = newSession.data?.data?.sessionId || newSession.data?.sessionId;
          const sessionData = newSession.data?.data || newSession.data;
          
          if (sessionId) {
            console.log('✅ Session created successfully with ID:', sessionId);
            setSessionData(sessionData);
            // Store session in sessionStorage for header-based transmission
            sessionStorage.setItem('session', JSON.stringify(sessionData));
            setIsSessionReady(true);
          } else {
            console.log('❌ Created session has no sessionId:', newSession);
            Logger.error('Created session has no sessionId:', newSession);
            setIsSessionReady(false);
          }
        } catch (createError) {
          Logger.error('Failed to create session:', createError);
          setIsSessionReady(false);
        }
      } else {
        console.log('✅ Using existing session:', session);
        const sessionId = session.data?.data?.sessionId || session.data?.sessionId;
        const sessionData = session.data?.data || session.data;
        
        if (sessionId) {
          console.log('✅ Existing session ID:', sessionId);
          setSessionData(sessionData);
          // Store session in sessionStorage for header-based transmission
          sessionStorage.setItem('session', JSON.stringify(sessionData));
          setIsSessionReady(true);
        } else {
          console.log('❌ Existing session has no sessionId:', session);
          Logger.error('Existing session has no sessionId:', session);
          setIsSessionReady(false);
        }
      }
    } catch (err) {
      Logger.error('Auth initialization failed:', err);
      setIsSessionReady(false);
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
          if (sessionResponse.success) {
            setSessionData(sessionResponse.data);
            sessionStorage.setItem('session', JSON.stringify(sessionResponse.data));
          }
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
          if (sessionResponse.success) {
            setSessionData(sessionResponse.data);
            sessionStorage.setItem('session', JSON.stringify(sessionResponse.data));
          }
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
    sessionStorage.setItem('session', JSON.stringify(session.data));
  };

  const value: AuthContextType = {
    userInformation,
    userSessionData,
    sessionData,
    isLoading,
    isSessionReady,
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
