'use client';

import useSWR, { SWRResponse } from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';

interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface ProductsAPIResponse {
  success: boolean;
  data: Product[];
}

interface ProductsResponse {
  products: Product[] | [];
  isLoading: boolean;
  error: string | null;
}

const useProducts = (): ProductsResponse => {
  const {
    data,
    error,
    isLoading,
  }: SWRResponse<ProductsAPIResponse, RequestError> = useSWR(
    'products',
    getProducts,
    {
      suspense: false,
    },
  );

  return {
    products: data?.data || [],
    isLoading,
    error: error?.message ? error.message : null,
  };
};

export default useProducts;
