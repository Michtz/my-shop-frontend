import { axiosInstance } from '@/requests/base.request';
import { productsApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  ProductFilters,
  IProduct,
} from '@/types/product.types';

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(`${productsApiUrl}`, {
      withCredentials: false,
    });

    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      return response.data as ProductResponse;
    }

    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data as IProduct[],
      } as ProductResponse;
    }

    return {
      success: false,
      error: 'Unexpected response structure',
    } as ProductResponse;
  } catch (e) {
    Logger.error('Unable to get all products');
    throw e;
  }
};

export const getProduct = async (uuid: string): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(`${productsApiUrl}/${uuid}`, {
      withCredentials: false,
    });

    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      return response.data as ProductResponse;
    }

    if (
      response.data &&
      typeof response.data === 'object' &&
      '_id' in response.data
    ) {
      return {
        success: true,
        data: response.data as IProduct[],
      } as ProductResponse;
    }

    return {
      success: false,
      error: 'Product not found',
    } as ProductResponse;
  } catch (e) {
    Logger.error('Unable to get product');
    throw e;
  }
};

export const createProduct = async (
  productData: CreateProductRequest,
  imageFile?: File,
): Promise<ProductResponse> => {
  try {
    if (imageFile) {
      // Mit Bild - FormData verwenden
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      formData.append('image', imageFile);

      const response = await axiosInstance.post(`${productsApiUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
      });
      return response.data;
    } else {
      // Ohne Bild - JSON verwenden
      const response = await axiosInstance.post(
        `${productsApiUrl}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            withCredentials: false,
          },
        },
      );
      return response.data;
    }
  } catch (e) {
    Logger.error('Unable to create product');
    throw e;
  }
};

export const updateProduct = async (
  uuid: string,
  updateData: UpdateProductRequest,
  imageFile?: File,
): Promise<ProductResponse> => {
  try {
    if (imageFile) {
      // Mit Bild - FormData verwenden
      const formData = new FormData();
      formData.append('data', JSON.stringify(updateData));
      formData.append('image', imageFile);

      const response = await axiosInstance.put(
        `${productsApiUrl}/${uuid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            withCredentials: false,
          },
        },
      );
      return response.data;
    } else {
      // Ohne Bild - JSON verwenden
      const response = await axiosInstance.put(
        `${productsApiUrl}/${uuid}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            withCredentials: false,
          },
        },
      );
      return response.data;
    }
  } catch (e) {
    Logger.error('Unable to update product');
    throw e;
  }
};

export const updateStock = async (
  uuid: string,
  stockData: UpdateStockRequest,
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${productsApiUrl}/${uuid}/stock`,
      stockData,
      {
        headers: {
          'Content-Type': 'application/json',
          withCredentials: false,
        },
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to update product stock');
    throw e;
  }
};

export const deleteProduct = async (uuid: string): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.delete(`${productsApiUrl}/${uuid}`, {
      withCredentials: false,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to delete product');
    throw e;
  }
};
