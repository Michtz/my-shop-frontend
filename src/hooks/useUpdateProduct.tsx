'use client';

import { useState } from 'react';
import axios from 'axios';
import { mutate } from 'swr';
import { Product } from '@/hooks/useProduct';

interface UpdateProductProps {
  id: string;
  data: Partial<Product>;
}

interface UseUpdateProductResponse {
  updateProduct: (props: UpdateProductProps) => Promise<Product>;
  isUpdating: boolean;
  error: Error | null;
}

export const useUpdateProduct = (): UseUpdateProductResponse => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProduct = async ({
    id,
    data,
  }: UpdateProductProps): Promise<Product> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await axios.put<{ data: Product }>(
        `http://localhost:4200/api/products/${id}`,
        data,
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
