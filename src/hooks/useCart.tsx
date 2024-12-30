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

const useCart = () => {
  const { data, error, isLoading } = useSWR<Product[]>(
    '/api/cart/test-user-123',
    async (url: string) => {
      const response = await axios.get(`http://localhost:4200${url}`);
      return response.data.data;
    },
  );

  console.log(data);
  return {
    products: data,
    isLoading,
    error: error?.message,
  };
};

export default useCart;
