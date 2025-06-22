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
  const token: string = JSON.parse(sessionStorage.getItem('user')!)?.token;

  if (token) request.headers.Authorization = `Bearer ${token}`;
  // console.log('is token', JSON.parse(sessionStorage.getItem('user')!), token);
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

    Logger.error('API-Error:', returnError);
    return Promise.reject(returnError);
  },
);
