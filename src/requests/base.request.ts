import axios from 'axios';
import { localApiUrl } from '@/config/api.config';

export const axiosInstance = axios.create({
  baseURL: localApiUrl,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (request) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const returnError = {
      message: error.message || 'Error',
      code: error.response?.status || 'UNKNOWN_ERROR',
      url: error.config?.url,
    };

    console.error('API-Error:', returnError);
    return Promise.reject(returnError);
  },
);

export const setAccessToken = (token) => {
  sessionStorage.setItem('access_token', token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem('access_token');
};

export const removeAccessToken = () => {
  sessionStorage.removeItem('access_token');
};
