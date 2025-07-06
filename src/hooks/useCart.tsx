'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getCart } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthHook';
import useSocket from '@/hooks/useSocket';
import { CartSocketData } from '@/types/socket.types';

interface CartAPIResponse {
  success: boolean;
  data: any;
}

interface CartItemWithReservation {
  productId: string;
  quantity: number;
  price: number;
  reservedUntil?: Date;
  reservationTimeLeft?: number; // sec
  product?: any;
}

interface CartResponse {
  cart: any | null;
  cartItems: CartItemWithReservation[] | null;
  isLoading: boolean;
  error: string | null;
  mutate: any;
  isConnected: boolean;
  cartCount: { [productId: string]: number };
  hasReservationConflicts: boolean;
}

const useCart = (): CartResponse => {
  const { sessionData, userSessionData } = useAuth();
  const { isConnected, isReady } = useSocket();
  const [socketData, setSocketData] = useState<CartSocketData>({
    cartCount: {},
    reservationTimers: {},
    stockConflicts: [],
  });

  const cartKey = sessionData?.sessionId;
  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    cartKey ? `cart-${cartKey}` : null,
    () => getCart(sessionData?.sessionId as string, userSessionData?.user?.id),
    {
      suspense: false,
      refreshInterval: 30000,
    },
  );

  const processCartItems = (): CartItemWithReservation[] | null => {
    if (!data?.data?.items) return null;

    return data.data.items.map((item: any) => {
      const reservedUntil = item.reservedUntil
        ? new Date(item.reservedUntil)
        : null;
      const now = new Date();
      const reservationTimeLeft = reservedUntil
        ? Math.max(
            0,
            Math.floor((reservedUntil.getTime() - now.getTime()) / 1000),
          )
        : 0;

      return {
        ...item,
        reservedUntil,
        reservationTimeLeft,
      };
    });
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
    hasReservationConflicts: socketData.stockConflicts.length > 0,
  };
};

export default useCart;
