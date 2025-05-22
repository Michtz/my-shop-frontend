'use client';

import useSWR from 'swr';
import axios from 'axios';
import { getCart } from '@/requests/cart';
import { getProduct } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { Product } from '@/hooks/useProduct';

interface Cart {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface CartAPIResponse {
  success: boolean;
  data: Product;
}

interface CartResponse {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const useCart = (sessionId: string): CartResponse => {
  /*    const cart = await getCart(sessionId);*/

  const { data, error, isLoading } = useSWR<CartAPIResponse, RequestError>(
    sessionId,
    getCart,
    {
      suspense: false,
    },
  );

  return {
    cart: data?.data || null,
    isLoading,
    error: error?.message ? error.message : null,
  };
};

export default useCart;
