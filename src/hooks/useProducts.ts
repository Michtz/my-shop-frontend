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
interface ProductsResponse {
  products: Product[] | [];
  isLoading: boolean;
  error: string | null;
}
const useProducts = (): ProductsResponse => {
  const { data, error, isLoading } = useSWR<Product[]>(
    '/api/products',
    async (url: string) => {
      const response = await axios.get(`http://localhost:4200${url}`);
      return response.data.data;
    },
  );

  const safeProducts: Product[] = data || [];
  return {
    products: safeProducts,
    isLoading,
    error: error?.message ? error.message : null,
  };
};
export default useProducts;
