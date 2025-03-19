'use client';

import React, { FC, useEffect, useState } from 'react';
import useSWRImmutable, { SWRResponse } from 'swr';
import axios from 'axios';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
      _id: string;
    }[];
  };
}

export interface UseCartResponse {
  cartItems: CartResponse | undefined;
  error: Error | undefined;
}

export interface UseCreateCartProps {
  quantity: number;
  id: string | undefined;
}

const fetcher = async (url: string, id: string, quantity: number) => {
  const response = await axios.post(url, {
    productId: id,
    quantity: quantity,
  });
  return response.data;
};

export const useCreateCart = ({
  quantity,
  id,
}: UseCreateCartProps): UseCartResponse => {
  const [cartItems, setCartItems] = useState<CartResponse>();

  console.log(quantity, id);

  const page: SWRResponse<CartResponse, Error> = useSWR(
    '/api/cart/test-user-123/items',
    async () => {
      try {
        const response = await axios.post(
          'http://localhost:4200/api/cart/test-user-123/items',
          {
            productId: id,
            quantity: 1,
          },
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    {
      suspense: true,
    },
  );

  useEffect(() => {
    setCartItems(page.data);
  }, [page.data]);

  return {
    cartItems,
    error: page.error,
  };
};
