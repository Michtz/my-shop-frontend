'use client';

import useSWR, { SWRResponse } from 'swr';
import { getProduct } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { useParams, useRouter } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import { getCart } from '@/requests/cart.request';

export interface Product {
  _id: string;
  name?: string;
  price: number;
  stockQuantity?: number;
  description?: string;

  quantity?: number;
  productInfo?: any;
  productId?: string;
}

interface ProductAPIResponse {
  success: boolean;
  data: Product;
}

interface ProductResponse {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

const useProduct = (): ProductResponse => {
  const params: Params = useParams();
  const uuid = params?.id as string;

  const { data, error, isLoading } = useSWR<ProductAPIResponse, RequestError>(
    uuid,
    getProduct,
    {
      suspense: false,
    },
  );

  return {
    product: data?.data || null,
    isLoading,
    error: error?.message ? error.message : null,
  };
};
export default useProduct;
