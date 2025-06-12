'use client';

import useSWR, { mutate } from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import {
  IProduct,
  ProductFilters,
  ProductResponse,
} from '@/types/product.types';

interface ProductsResponse {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => void;
}

const useProducts = (filters?: ProductFilters): ProductsResponse => {
  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    'products',
    () => getProducts(),
    { suspense: false },
  );

  const refreshProducts = (): void => {
    mutate('products');
  };

  const extractAndFilterProducts = (): IProduct[] => {
    if (!data?.success || !data.data) {
      return [];
    }

    let products: IProduct[] = Array.isArray(data.data)
      ? data.data
      : [data.data];

    if (filters?.category) {
      products = products.filter(
        (product: IProduct) => product.category === filters.category,
      );
    }

    if (filters?.isActive !== undefined) {
      products = products.filter(
        (product: IProduct) => product.isActive === filters.isActive,
      );
    }

    return products;
  };

  const productsData: IProduct[] = extractAndFilterProducts();

  const errorMessage: string | null =
    error?.message ||
    (data && !data.success ? data.error || 'Unbekannter Fehler' : null);

  return {
    products: productsData,
    isLoading,
    error: errorMessage,
    refreshProducts,
  };
};

export default useProducts;
