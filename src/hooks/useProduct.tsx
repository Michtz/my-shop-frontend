'use client';

import useSWR, { mutate } from 'swr';
import { getProduct } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { useParams } from 'next/navigation';
import { IProduct, ProductResponse } from '@/types/product.types';

export interface SingleProductResponse {
  product: IProduct | null;
  isLoading: boolean;
  error: string | null;
  refreshProduct: () => void;
}

const useProduct = (): SingleProductResponse => {
  const params = useParams();
  const uuid = params?.id as string;

  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    uuid,
    () => getProduct(uuid),
    { suspense: false },
  );

  const refreshProduct = () => {
    mutate(uuid);
  };

  const extractProduct = (): IProduct | null => {
    if (!data || !data.success || !data.data) return null;
    return Array.isArray(data.data) ? data.data[0] : data.data;
  };

  return {
    product: extractProduct(),
    isLoading,
    error:
      error?.message ||
      (data && !data.success ? data.error || 'Unknown error' : null),
    refreshProduct,
  };
};

export default useProduct;
