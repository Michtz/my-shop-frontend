'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';

export interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface UseProductResponse {
  product: Product | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useProduct = (): UseProductResponse => {
  const params: Params = useParams();
  const id = params.id as string;
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
