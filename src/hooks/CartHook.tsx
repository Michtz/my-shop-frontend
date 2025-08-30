'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthHook';
import useSocket from '@/hooks/SocketHook';
import { CartSocketData } from '@/types/socket.types';

interface CartAPIResponse {
  success: boolean;
  data: any;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: any;
}

interface CartResponse {
  cart: any | null;
  cartItems: CartItem[] | null;
  isLoading: boolean;
  error: string | null;
  mutate: any;
  isConnected: boolean;
  cartCount: { [productId: string]: number };
}

const useCart = (): CartResponse => {
  const { sessionData, userSessionData, isSessionReady } = useAuth();
  const { isConnected } = useSocket();
  const [socketData] = useState<CartSocketData>({
    cartCount: {},
    stockConflicts: [],
  });

  const cartKey = sessionData?.sessionId;
  const shouldFetch = isSessionReady && cartKey && cartKey !== 'undefined';

  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    shouldFetch ? `cart-${cartKey}` : null,
    () => {
      return getCart(cartKey!, userSessionData?.user?.id);
    },
    {
      suspense: false,
      refreshInterval: 30000,
    },
  );

  const processCartItems = (): CartItem[] | null => {
    const items = data?.data?.data?.items || data?.data?.items;
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return items;
  };

  useEffect(() => {
    if (!data?.data?.items) return;
    const interval = setInterval(() => {
      mutate();
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.data?.items, mutate]);

  return {
    cart: data?.data || null,
    cartItems: processCartItems(),
    isLoading,
    error: error?.message ? error.message : null,
    mutate: mutate,
    isConnected,
    cartCount: socketData.cartCount,
  };
};

export default useCart;
