'use client';

import useSWR, { SWRResponse } from 'swr';
import { getProduct, getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { NextRouter, useRouter } from 'next/router';

export interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface ProductsAPIResponse {
  success: boolean;
  data: Product;
}

interface ProductResponse {
  products: Product | '';
  isLoading: boolean;
  error: string | null;
}

const useProducts = (): ProductResponse => {
  const router = useRouter();
  console.log(router);
  // const {
  //   data,
  //   error,
  //   isLoading,
  // }: SWRResponse<ProductsAPIResponse, RequestError> = useSWR(
  //   'products',
  //   getProduct(uuid),
  //   {
  //     suspense: false,
  //   },
  // );

  return {
    products: data?.data || [],
    isLoading,
    error: error?.message ? error.message : null,
  };
};

export default useProducts;
