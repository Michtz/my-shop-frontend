import { SessionResponse } from '@/types/auth';
import { ProductResponse } from '@/types/product.types';
import { axiosInstance } from '@/requests/base.request';
import {
  authApiUrl,
  cartApiUrl,
  productsApiUrl,
  sessionsApiUrl,
} from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
//
// async createSession(data: { data: any }): Promise<SessionResponse> {
//   return this.request('/api/sessions', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }
//
//
// const requestBody = {
//   items: [
//     {
//       quantity: quantity,
//     },
//   ],
// };
//
// return await axiosInstance.put(
//   `${cartApiUrl}/${identifier}/product/${productId}`,
//   requestBody,
// );
//

export const createSession = async (): Promise<any> => {
  try {
    const requestBody = {
      data: {
        preferences: {
          theme: 'dark',
          language: 'de',
        },
      },
    };
    const response = await axiosInstance.post(
      `${sessionsApiUrl}`,
      requestBody,
      { withCredentials: false },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to create session');
    throw e;
  }
};

export const getSession = async (token?: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `${sessionsApiUrl}/sess_hfmc8efhstuzwsuygstgxo`,
      { withCredentials: false },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to get session');
    throw e;
  }
};

export const validateToken = async (token?: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/validate-token`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmZmNWU2ZjllZmFmMjNkZWI2OTYyMiIsImVtYWlsIjoidGVzdGFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwMDEwMTA3LCJleHAiOjE3NTAwMTEwMDd9.Y8aOlLBjR4Af1cqcVY9EfrTPiO40rw6XlZ3oUp0mdUA'}`,
        },
        withCredentials: false,
      },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to validate token');
    throw e;
  }
};
export const register = async (sessionId: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/register`,
      {
        email: 'testadaamin@example.com',
        password: 'Password123!',
        firstName: 'franz',
        lastName: 'Mustermann',
        sessionId: sessionId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to register');
    throw e;
  }
};

export const refreshToken = async (token?: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/validate-token`,
      {
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmZmNWU2ZjllZmFmMjNkZWI2OTYyMiIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUwMDgzNzk3LCJleHAiOjE3NTA2ODg1OTd9.GHvrKFh3DaogVyV0QN8-jGiEejYuOsd2nbNVdrNa6jM',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to refresh token');
    throw e;
  }
};

export const getCurrentUser = async (token?: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${authApiUrl}/validate-token`, {
      headers: {
        Authorization: `Bearer ${token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmZmNWU2ZjllZmFmMjNkZWI2OTYyMiIsImVtYWlsIjoidGVzdGFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwMDEwMTA3LCJleHAiOjE3NTAwMTEwMDd9.Y8aOlLBjR4Af1cqcVY9EfrTPiO40rw6XlZ3oUp0mdUA'}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to get current user');
    throw e;
  }
};

export const login = async (token?: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/login`,
      {
        email: 'testadmin@example.com',
        password: 'Password123!',
        sessionId: 'sess_vghxtevud7clv12m2lmcgh',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      },
    );
    console.log(response);
    return response.data;
  } catch (e) {
    Logger.error('Unable to login');
    throw e;
  }
};
