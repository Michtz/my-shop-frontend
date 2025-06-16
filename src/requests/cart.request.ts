import { axiosInstance } from '@/requests/base.request';
import { cartApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const getCart = async (sessionId: string): Promise<any> => {
  try {
    return await axiosInstance.get(`${cartApiUrl}/${sessionId}`, {
      withCredentials: false,
    });
  } catch (e) {
    Logger.error('Unable to get the cart');
    throw e;
  }
};

export const updateCart = async (sessionId: string): Promise<any> => {
  try {
    return await axiosInstance.get(`${cartApiUrl}/${sessionId}`, {
      withCredentials: false,
    });
  } catch (e) {
    Logger.error('Unable to get the cart');
    throw e;
  }
};

export const addToCart = async (
  sessionId: string,
  productId: string,
  quantity: number | string,
): Promise<any> => {
  try {
    const requestBody = {
      items: [
        {
          productId: productId,
          quantity: quantity,
        },
      ],
    };
    return await axiosInstance.put(`${cartApiUrl}/${sessionId}`, requestBody, {
      withCredentials: false,
    });
  } catch (e) {
    Logger.error('Unable to add to cart');
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
      { withCredentials: false },
    );
  } catch (e) {
    Logger.error('Unable to update the cart item');
    throw e;
  }
};

export const replaceCartItems = async (
  sessionId: string,
  items: Array<{ productId: string; quantity: number }>,
): Promise<any> => {
  try {
    const requestBody = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    return await axiosInstance.put(
      `${cartApiUrl}/${sessionId}/items`,
      requestBody,
      { withCredentials: false },
    );
  } catch (e) {
    Logger.error('Unable to replace cart items');
    throw e;
  }
};
