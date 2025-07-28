import axios from 'axios';
import { prodApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

// Fallback to prodApiUrl if environment variable is not set
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || prodApiUrl;
console.log('🔧 Axios baseURL:', baseURL);

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
    
    // Note: Session ID is handled via URL parameters in individual requests
    // Custom headers like X-Session-ID are blocked by CORS policy
  } catch (err) {
    // Handle JSON parse errors gracefully
    console.warn('Failed to parse session storage data:', err);
  }
  
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Don't unwrap response.data automatically to preserve API response structure
    return response;
  },
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
