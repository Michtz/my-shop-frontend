'use client';

import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';

interface Cart {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

interface CartAPIResponse {
  success: boolean;
  data: any;
}

interface CartResponse {
  cart: any | null;
  cartItems: any | null;
  isLoading: boolean;
  error: string | null;
}

const useCart = (sessionId: string): CartResponse => {
  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(sessionId, getCart, {
    suspense: false,
  });

  return {
    cart: data?.data || null,
    cartItems: data?.data?.items || null,
    isLoading,
    error: error?.message ? error.message : null,
  };
};

export default useCart;
