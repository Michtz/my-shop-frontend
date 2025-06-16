'use client';

import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthContext';

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
  mutate: any;
}

const useCart = (): CartResponse => {
  const { sessionId, user, isAuthenticated } = useAuth();

  // Use user ID if authenticated, otherwise sessionId
  const cartKey = isAuthenticated && user ? user.id : sessionId;
  console.log(cartKey);
  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(cartKey ? `cart-${cartKey}` : null, () => getCart(sessionId as string), {
    suspense: false,
  });

  return {
    cart: data?.data || null,
    cartItems: data?.data?.items || null,
    isLoading,
    error: error?.message ? error.message : null,
    mutate: mutate,
  };
};

export default useCart;
