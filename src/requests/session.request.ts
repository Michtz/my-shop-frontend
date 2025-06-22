import { axiosInstance } from '@/requests/base.request';
import { authApiUrl, sessionsApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const createSession = async (preferences?: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${sessionsApiUrl}`, {
      data: {
        preferences: preferences || {
          theme: 'dark',
          language: 'de',
        },
      },
    });
    return response;
  } catch (e) {
    Logger.error('Unable to create session');
    throw e;
  }
};

export const getCurrentSession = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${sessionsApiUrl}/current`);
    console.log('response', response.data);

    return response;
  } catch (e) {
    Logger.error('Unable to get current session', e);
    throw e;
  }
};

export const updateCurrentSession = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`${sessionsApiUrl}/current`, {
      data,
    });
    return response;
  } catch (e) {
    Logger.error('Unable to update session');
    throw e;
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${authApiUrl}/login`, {
      email,
      password,
    });
    return response;
  } catch (e) {
    Logger.error('Unable to login');
    throw e;
  }
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${authApiUrl}/register`, {
      email,
      password,
      firstName,
      lastName,
    });
    return response;
  } catch (e) {
    Logger.error('Unable to register');
    throw e;
  }
};
export const logout = async (sessionId: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/logout`,
      { sessionId: sessionId },
      {
        withCredentials: true,
      },
    );
    sessionStorage.removeItem('user');

    return response;
  } catch (e) {
    Logger.error('Unable to logout');
    throw e;
  }
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${authApiUrl}/me`);
    return response;
  } catch (e) {
    Logger.error('Unable to get current user');
    throw e;
  }
};

export const validateToken = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${authApiUrl}/validate-token`);
    return response;
  } catch (e) {
    Logger.error('Unable to validate token');
    throw e;
  }
};
