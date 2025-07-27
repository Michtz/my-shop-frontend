'use client';

import { useState } from 'react';
import axios from 'axios';
import { mutate } from 'swr';
import { IProduct } from '@/types/product.types';

interface UpdateProductProps {
  id: string;
  data: Partial<IProduct>;
}

interface UseUpdateProductResponse {
  updateProduct: (props: UpdateProductProps) => Promise<IProduct>;
  isUpdating: boolean;
  error: Error | null;
}

export const useUpdateProduct = (): UseUpdateProductResponse => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProduct = async ({
    id,
    data,
  }: UpdateProductProps): Promise<IProduct> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await axios.put<{ data: IProduct }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
        data,
        { withCredentials: true }
      );
      await mutate(`/api/products/${id}`);

      await mutate('/api/products');

      return response.data.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProduct,
    isUpdating,
    error,
  };
};
