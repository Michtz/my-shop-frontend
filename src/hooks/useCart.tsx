'use client';

import useSWR from 'swr';
import axios from 'axios';
import { getCart } from '@/requests/cart.request';
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
  data: any;
}

interface CartResponse {
  cart: any | null;
  items: any | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
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
    items: data?.data?.items || null,
    isLoading,
    error: error?.message ? error.message : null,
    mutate,
  };
};

export default useCart;
