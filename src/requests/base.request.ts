import axios from 'axios';
import { localApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const axiosInstance = axios.create({
  baseURL: localApiUrl,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Enable cookies
});

axiosInstance.interceptors.request.use(async (request) => {
  // Cookie-based auth - no manual token handling needed
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

    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      try {
        await fetch('/api/auth/clear-cookies', { method: 'POST' });
      } catch {}

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    Logger.error('API-Error:', returnError);
    return Promise.reject(returnError);
  },
);
