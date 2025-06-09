'use client';

import useSWR, { mutate } from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import {
  IProduct,
  ProductResponse,
  ProductFilters,
} from '@/types/product.types';

interface ProductsResponse {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => void;
}

const useProducts = (filters?: ProductFilters): ProductsResponse => {
  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    filters ? ['products', filters] : 'products',
    () => getProducts(filters),
    { suspense: false },
  );

  const refreshProducts = () => {
    mutate(filters ? ['products', filters] : 'products');
  };

  const extractProducts = (): IProduct[] => {
    if (!data || !data.success || !data.data) return [];
    return Array.isArray(data.data) ? data.data : [data.data];
  };

  return {
    products: extractProducts(),
    isLoading,
    error:
      error?.message ||
      (data && !data.success ? data.error || 'Unknown error' : null),
    refreshProducts,
  };
};

export default useProducts;
