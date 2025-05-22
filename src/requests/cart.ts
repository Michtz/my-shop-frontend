import { axiosInstance } from '@/requests/base.request';
import { cartApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const getCart = async (sessionId: string): Promise<any> => {
  try {
    return await axiosInstance.get(`${cartApiUrl}/${sessionId}`);
  } catch (e) {
    Logger.error('Unable to get the cart');
    throw e;
  }
};
export const updateCart = async (sessionId: string): Promise<any> => {
  try {
    return await axiosInstance.get(`${cartApiUrl}/${sessionId}`);
  } catch (e) {
    Logger.error('Unable to get the cart');
    throw e;
  }
};
