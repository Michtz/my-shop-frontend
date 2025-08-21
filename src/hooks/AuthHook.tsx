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

  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting auth initialization...');
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Try to get current session
      let session;
      try {
        let sessionResponse = await getCurrentSession();

        if (!sessionResponse.data.success) {
          console.log(sessionResponse);

          sessionResponse = await createSession();
          console.log(sessionResponse.data.success);
        } else {
          console.log('else', sessionResponse.data.success);
        }

        console.log('📡 Trying to get current session...', sessionResponse);
        // console.log(sessionResponse1);
        // const sessionDateSessionStorage = JSON.parse(
        //   sessionStorage.getItem('session')!,
        // );
        // console.log(sessionDateSessionStorage);
        // let sessionResponse;
        // if (!sessionDateSessionStorage) {
        //   sessionResponse = sessionResponse1;
        // } else {
        //   sessionResponse = sessionResponse1;
        // }
        // console.log('📡 getCurrentSession response:', sessionResponse);

        // Check if the response indicates success
        const sessionId = sessionResponse?.data.data.sessionId;
        console.log(sessionResponse?.data.data);
        if (sessionId) {
          console.log('✅ Found valid existing session:', sessionResponse);
          session = sessionResponse;
          setSessionData(sessionResponse.data.data);
          sessionStorage.setItem(
            'session',
            JSON.stringify(sessionResponse?.data.data),
          );
        } else {
          console.log('❌ Session not found or invalid, will create new one');
          session = { success: false };
        }
        console.log(sessionData);
      } catch (sessionError) {
        console.log('❌ Failed to get current session:', sessionError);
        session = { success: false };
      }
      console.log(session);
      //
      // // Handle user authentication - check if user exists in sessionStorage
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log(
            '🔄 Found user in storage, checking token validity:',
            user,
          );

          // Check if token exists before trying to refresh
          if (!user.token || !user.refreshToken) {
            console.log('❌ Invalid user data, missing tokens');
            sessionStorage.removeItem('user');
            setUserSessionData(undefined);
            setUserInformation(undefined);
          } else {
            // Try to refresh token
            try {
              const refreshResponse = await refreshToken();
              console.log('🔄 Token refresh response:', refreshResponse);

              // Handle nested response structure
              const refreshedData =
                refreshResponse.data?.data || refreshResponse.data;
              if (refreshedData && refreshedData.token) {
                console.log('✅ Token refreshed successfully');
                sessionStorage.setItem('user', JSON.stringify(refreshedData));
                setUserSessionData(refreshedData);

                // Get current user info
                const userInformation = await getCurrentUser();
                console.log('👤 Current user response:', userInformation);
                const userInfoData = userInformation.data?.user;
                if (userInfoData) {
                  setUserInformation(userInfoData);
                }
              } else {
                console.log('❌ Token refresh failed or invalid response');
                sessionStorage.removeItem('user');
                setUserSessionData(undefined);
                setUserInformation(undefined);
              }
            } catch (refreshError) {
              console.log('❌ Token refresh failed:', refreshError);
              sessionStorage.removeItem('user');
              setUserSessionData(undefined);
              setUserInformation(undefined);
            }
          }
        } catch (parseError) {
          console.log('❌ Failed to parse user data from storage:', parseError);
          sessionStorage.removeItem('user');
          setUserSessionData(undefined);
          setUserInformation(undefined);
        }
      }
      //
      // if (session.success === false) {
      //   try {
      //     const newSession = await createSession();
      //     const sessionId = newSession.data.data?.sessionId;
      //     const sessionData = newSession.data.data;
      //
      //     if (sessionId) {
      //       setSessionData(sessionData);
      //       sessionStorage.setItem('session', JSON.stringify(sessionData));
      //       setIsSessionReady(true);
      //     } else {
      //       Logger.error('Created session has no sessionId:', newSession);
      //       setIsSessionReady(false);
      //     }
      //   } catch (createError) {
      //     Logger.error('Failed to create session:', createError);
      //     setIsSessionReady(false);
      //   }
      // } else {
      //   console.log('✅ Using existing session:', session);
      //   const sessionId = session?.data.data.sessionId;
      //   const sessionData = session;
      //
      //   if (sessionId) {
      //     console.log('✅ Existing session ID:', sessionId);
      //     setSessionData(sessionData);
      //     sessionStorage.setItem('session', JSON.stringify(sessionData)); // maybe not nesesaire todo
      //     setIsSessionReady(true);
      //   } else {
      //     console.log('❌ Existing session has no sessionId:', session);
      //     Logger.error('Existing session has no sessionId:', session);
      //     setIsSessionReady(false);
      //   }
      // }

      setSessionData(sessionData);
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
      console.log('🔐 Login response:', response);
      const apiResponse = response.data as any;
      const loginData = apiResponse?.data || apiResponse;
      const isSuccess = apiResponse?.success !== false && loginData;

      if (isSuccess && loginData) {
        console.log('✅ Login successful, user data:', loginData);

        // Store user data in session storage
        setUserSessionData(loginData);
        sessionStorage.setItem('user', JSON.stringify(loginData));

        // Try to get user information after login
        try {
          const userInfo = await getCurrentUser();
          console.log('👤 User info response:', userInfo);
          const userInfoData = userInfo.data?.data?.user || userInfo.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
        } catch (userErr) {
          console.warn('Failed to get user info after login:', userErr);
        }

        // After successful login, we don't need to refresh the session
        // The existing session continues to work and the user is now authenticated
        console.log('✅ Login completed, keeping existing session');
      } else {
        console.log('❌ Login failed or no data:', response);
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
      console.log('📝 Register response:', response);

      // Handle nested response structure
      const registerData = response.data?.data || response.data;
      const isSuccess = response.data?.success !== false && registerData;

      if (isSuccess && registerData) {
        console.log('✅ Registration successful, user data:', registerData);

        // Handle different response structures for registration
        const userData = registerData.user || registerData;
        setUserSessionData(userData);
        sessionStorage.setItem('user', JSON.stringify(registerData));

        // Try to get user information after registration
        try {
          const userInfo = await getCurrentUser();
          console.log('👤 User info after registration:', userInfo);
          const userInfoData = userInfo.data?.data?.user || userInfo.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
        } catch (userErr) {
          console.warn('Failed to get user info after registration:', userErr);
        }

        // After successful registration, we don't need to refresh the session
        // The existing session continues to work and the user is now authenticated
        console.log('✅ Registration completed, keeping existing session');
      } else {
        console.log('❌ Registration failed or no data:', response);
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
