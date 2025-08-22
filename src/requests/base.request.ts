import axios from 'axios';
import { prodApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || prodApiUrl;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (request) => {
  try {
    const userStr = sessionStorage.getItem('user');
    const token: string = userStr ? JSON.parse(userStr)?.token : null;

    if (token) request.headers.Authorization = `Bearer ${token}`;

    // 🔍 DEBUG: Cookie & Credentials Check
    console.log('🚀 Outgoing Request:', {
      url: request.url,
      method: request.method,
      withCredentials: request.withCredentials,
      allCookies: document.cookie,
      sessionCookie: document.cookie
        .split(';')
        .find((c) => c.trim().startsWith('sessionId=')),
      hasToken: !!token,
      headers: request.headers,
    });
  } catch (err) {
    console.warn('Failed to parse session storage data:', err);
  }

  return request;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // 🔍 DEBUG: Response & Cookie Check
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      setCookieHeaders: response.headers['set-cookie'],
      cookiesAfterResponse: document.cookie,
      data: response.data,
    });

    return response;
  },
  async (error) => {
    // 🔍 DEBUG: Error & Cookie Check
    Logger.error('❌ Request failed:', {
      status: error.response?.status,
      url: error.config?.url,
      currentCookies: document.cookie,
      errorData: error.response?.data,
      message: error.message,
    });

    const returnError = {
      message: error.message || 'Error',
      code: error.response?.status || 'UNKNOWN_ERROR',
      url: error.config?.url,
    };

    Logger.error('API-Error:', returnError);
    return Promise.reject(returnError);
  },
);
