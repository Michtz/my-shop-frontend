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
    const response = await axiosInstance.get(`${sessionsApiUrl}/current`, {
      withCredentials: true,
    });

    return response;
  } catch (e) {
    Logger.error('Unable to get current session', e);
    throw e;
  }
};

export const updateCurrentSession = async (
  data: any,
  sessionId: string,
): Promise<any> => {
  try {
    const response = await axiosInstance.put(`${sessionsApiUrl}/${sessionId}`, {
      data,
    });
    return response;
  } catch (e) {
    Logger.error('Unable to update session');
    throw e;
  }
};

interface LoginUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginSuccessResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken: string;
    user: LoginUser;
  };
  error?: string;
}
export const login = async (
  email: string,
  password: string,
): Promise<LoginSuccessResponse> => {
  try {
    return await axiosInstance.post(`${authApiUrl}/login`, {
      email,
      password,
    });
  } catch (e) {
    Logger.error('Unable to login', e);
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
    const response = await axiosInstance.get(`${authApiUrl}/me`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response;
  } catch (e) {
    Logger.error('Unable to get current user');
    throw e;
  }
};

export const validateToken = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${authApiUrl}/validate-token`, {
      withCredentials: true,
    });
    return response;
  } catch (e) {
    Logger.error('Unable to validate token');
    throw e;
  }
};
export const refreshToken = async (): Promise<any> => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') as any);
    const response = await axiosInstance.post(
      `${authApiUrl}/refresh-token`,
      { refreshToken: user?.refreshToken },
      {
        withCredentials: true,
      },
    );
    return response;
  } catch (e) {
    Logger.error('Unable to validate token');
    throw e;
  }
};
