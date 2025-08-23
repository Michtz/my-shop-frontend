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
  LoginSuccessResponse,
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

      try {
        let sessionResponse = await getCurrentSession();
        if (!sessionResponse.success) {
          sessionResponse = await createSession();
        }

        const sessionId: string = sessionResponse?.data.sessionId;

        if (sessionId) {
          setSessionData(sessionResponse?.data);
          setIsSessionReady(true);
          sessionStorage.setItem(
            'session',
            JSON.stringify(sessionResponse?.data.data),
          );
        }
      } catch (sessionError) {
        Logger.error(sessionError);
      }

      const userStr = sessionStorage.getItem('user');

      if (userStr) {
        try {
          const user = JSON.parse(userStr);

          if (!user.token || !user.refreshToken) {
            sessionStorage.removeItem('user');
            setUserSessionData(undefined);
            setUserInformation(undefined);
          } else {
            try {
              const refreshResponse = await refreshToken();
              console.log('🔄 Token refresh response:', refreshResponse);

              // Handle nested response structure
              const refreshedData = refreshResponse?.data;
              if (refreshedData && refreshedData.token) {
                console.log('✅ Token refreshed successfully');
                sessionStorage.setItem('user', JSON.stringify(refreshedData));
                setUserSessionData(refreshedData);

                // Get current user info
                const userInformation = await getCurrentUser();
                console.log('👤 Current user response:', userInformation);
                const userInfoData = userInformation?.data.user;
                if (userInfoData) {
                  console.log(userInfoData);
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
    } catch (err) {
      Logger.error('Auth initialization failed:', err);
      setIsSessionReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: LoginSuccessResponse = await _login(email, password);

      if (response.success) {
        const newSessionData = {
          ...sessionData,
          data: {
            ...sessionData?.data,
            isAuthenticated: true,
          },
        };
        setUserSessionData(response?.data);
        sessionStorage.setItem('user', JSON.stringify(response?.data)); // backup
        sessionStorage.setItem('session', JSON.stringify(newSessionData));

        try {
          const userInfo = await getCurrentUser();
          const userInfoData = userInfo?.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
        } catch (userErr) {
          Logger.warn('Failed to get user info after login:', userErr);
        }
      } else {
        Logger.log('Login failed or no data:', response);
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
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await _register(email, password, firstName, lastName);

      // Handle nested response structure
      const registerData = response.data;
      const isSuccess = response?.success !== false && registerData;

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
          const userInfoData = userInfo?.data?.user;
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

    setUserSessionData(undefined);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('session');

    const session = await createSession();
    sessionStorage.setItem('session', JSON.stringify(session.data));
    setSessionData(session);
    setIsLoading(false);
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
