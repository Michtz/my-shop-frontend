'use client';

import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthHook';

interface CartAPIResponse {
  success: boolean;
  data: any;
}

interface CartResponse {
  cart: any | null;
  cartItems: any | null;
  isLoading: boolean;
  error: string | null;
  mutate: any;
}

const useCart = (): CartResponse => {
  const { sessionData } = useAuth();

  const cartKey = sessionData?.sessionId;
  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    cartKey ? `cart-${cartKey}` : null,
    () => getCart(sessionData?.sessionId as string),
    {
      suspense: false,
    },
  );

  return {
    cart: data?.data || null,
    cartItems: data?.data?.items || null,
    isLoading,
    error: error?.message ? error.message : null,
    mutate: mutate,
  };
};

export default useCart;
