'use client';

import useSWR from 'swr';
import axios from 'axios';
import { deepFreeze } from 'next/dist/shared/lib/deep-freeze';
import { FC } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface UseProductProps {
  id: string;
}

interface UseProductResponse {
  product: Product | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useProduct = ({ id }: UseProductProps): UseProductResponse => {
  console.log(id);
  const { data, error, isLoading } = useSWR<Product>(
    '/api/products',
    async (url: string) => {
      const response = await axios.get(`http://localhost:4200${url}/${id}`);
      return response.data.data;
    },
  );

  return {
    product: data,
    isLoading,
    error: error?.message,
  };
};
