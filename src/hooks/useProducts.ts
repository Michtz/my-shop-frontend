'use client';

import useSWR from 'swr';
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
}

const useProducts = (): ProductsResponse => {
  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    'products',
    () => getProducts(),
    { suspense: false },
  );

  const productsData: IProduct[] = data?.data || [];
  const errorMessage: string | null =
    error?.message ||
    (data && !data.success ? data.error || 'Unbekannter Fehler' : null);

  return {
    products: productsData,
    isLoading,
    error: errorMessage,
  };
};

export default useProducts;
