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
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
}

const useProduct = (): UseProductResponse => {
  const params: Params = useParams();
  const id = params.id as string;

  const { data, error, isLoading } = useSWR<Product>(
    `/api/products/${id}`,
    async (url: string) => {
      const response = await axios.get(`http://localhost:4200${url}`);
      return response.data.data;
    },
  );

  const safeProduct: Product | null = data || null;

  return {
    product: safeProduct,
    isLoading,
    error: error?.message,
  };
};

export default useProduct;
