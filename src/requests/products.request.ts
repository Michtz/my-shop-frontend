import { axiosInstance } from '@/requests/base.request';
import { productsApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const getProducts = async (): Promise<any> => {
  try {
    return await axiosInstance.get(`${productsApiUrl}`);
  } catch (e) {
    Logger.error('Unable to get all products');
    throw e;
  }
};
export const getProduct = async (uuid: string): Promise<any> => {
  try {
    return await axiosInstance.get(`${productsApiUrl}/${uuid}`);
  } catch (e) {
    Logger.error('Unable to get product');
    throw e;
  }
};
