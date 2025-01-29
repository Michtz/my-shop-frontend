'use client';

import useSWR from 'swr';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

const useProducts = () => {
  const { data, error, isLoading } = useSWR<Product[]>(
    '/api/products',
    async (url: string) => {
      const response = await axios.get(`http://localhost:4200${url}`);
      return response.data.data;
    },
  );

  return {
    products: data,
    isLoading,
    error: error?.message,
  };
};
export default useProducts;
