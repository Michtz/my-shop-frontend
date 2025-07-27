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
  const { sessionData, userSessionData, isSessionReady } = useAuth();
  const { isConnected } = useSocket();
  const [socketData] = useState<CartSocketData>({
    cartCount: {},
    reservationTimers: {},
    stockConflicts: [],
  });

  const cartKey = sessionData?.sessionId;
  const shouldFetch = isSessionReady && cartKey && cartKey !== 'undefined';
  
  console.log('🛒 useCart Debug:', { 
    isSessionReady, 
    cartKey, 
    shouldFetch,
    sessionData 
  });
  
  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    shouldFetch ? `cart-${cartKey}` : null,
    () => {
      console.log('🛒 Fetching cart for session:', cartKey);
      return getCart(cartKey!, userSessionData?.user?.id);
    },
    {
      suspense: false,
      refreshInterval: 30000,
    },
  );

  const processCartItems = (): CartItemWithReservation[] | null => {
    console.log('🛒 Processing cart items, data:', data);
    
    // Handle nested data structure: data.data.data.items
    const items = data?.data?.data?.items || data?.data?.items;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('🛒 No cart items found, items:', items);
      return null;
    }

    console.log('🛒 Processing', items.length, 'cart items');
    return items.map((item: any) => {
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

  const result = {
    cart: data?.data || null,
    cartItems: processCartItems(),
    isLoading,
    error: error?.message ? error.message : null,
    mutate: mutate,
    isConnected,
    cartCount: socketData.cartCount,
    hasReservationConflicts: socketData.stockConflicts.length > 0,
  };
  
  console.log('🛒 useCart returning:', result);
  return result;
};

export default useCart;
