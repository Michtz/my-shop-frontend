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
    return response.data;
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

    return response.data;
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
    return response.data;
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

export interface LoginSuccessResponse {
  success?: boolean;
  data?: {
    token: string;
    refreshToken: string;
    user: LoginUser;
  };
  error?: any;
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginSuccessResponse> => {
  try {
    const response = await axiosInstance.post(`${authApiUrl}/login`, {
      email,
      password,
    });
    return response.data as LoginSuccessResponse;
  } catch (e) {
    Logger.error('Unable to login', e);
    // @ts-expect-error Will get fixed soon
    return e?.message as string;
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
    return response.data;
  } catch (e) {
    Logger.error('Unable to register');
    console.log(e);
    return e;
  }
};
export const logout = async (sessionId: string): Promise<any> => {
  try {
    await axiosInstance.post(
      `${authApiUrl}/logout`,
      { sessionId: sessionId },
      {
        withCredentials: true,
      },
    );
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
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (e) {
    Logger.error('Unable to validate token');
    throw e;
  }
};
