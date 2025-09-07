'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthHook';
import useSocket from '@/hooks/SocketHook';
import { CartSocketData } from '@/types/socket.types';
import { IProduct } from '@/types/product.types';

interface CartAPIResponse {
  success: boolean;
  data: any;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: IProduct[];
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
  const { sessionData, userSessionData } = useAuth();
  const { isConnected } = useSocket();
  const [socketData] = useState<CartSocketData>({
    cartCount: {},
    stockConflicts: [],
  });

  const sessionId = sessionData?.sessionId as string;
  const userId = userSessionData?.user?.id;

  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    userId ? `cart-${userId}` : `cart-${sessionId}`,
    () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      return getCart(sessionData?.sessionId!, userSessionData?.user?.id);
    },
    {
      suspense: false,
    },
  );

  const processCartItems = (): CartItem[] | null => {
    const items = data?.data?.data?.items || data?.data?.items;
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return items;
  };
  useEffect(() => {
    if (!data?.data?.items) return;
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.items, userSessionData]);

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
