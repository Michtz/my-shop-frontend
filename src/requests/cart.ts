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

export const updateCartItem = async (
  sessionId: string,
  productId: string,
  quantity: number,
): Promise<any> => {
  try {
    const requestBody = {
      items: [
        {
          quantity: quantity,
        },
      ],
    };

    return await axiosInstance.put(
      `${cartApiUrl}/${sessionId}/product/${productId}`,
      requestBody,
    );
  } catch (e) {
    Logger.error('Unable to update the cart item');
    throw e;
  }
};
