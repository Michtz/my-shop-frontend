import axios from 'axios';
import { localApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import { getToken } from 'next-auth/jwt';

export const axiosInstance = axios.create({
  baseURL: localApiUrl,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (request) => {
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const returnError = {
      message: error.message || 'Error',
      code: error.response?.status || 'UNKNOWN_ERROR',
      url: error.config?.url,
    };

    if (error.response?.status === 401) {
      const isOnLoginPage =
        typeof window !== 'undefined' &&
        (window.location.pathname.includes('/login') ||
          window.location.pathname.includes('/register'));

      if (!isOnLoginPage) {
        if (typeof window !== 'undefined') {
          Logger.error('🔄 Redirecting to login due to 401');
          window.location.href = '/login';
        }
      } else {
        Logger.error(
          '⚠️ 401 on login page - this is expected for unauthenticated requests',
        );
      }
    }

    Logger.error('API-Error:', returnError);
    return Promise.reject(returnError);
  },
);
