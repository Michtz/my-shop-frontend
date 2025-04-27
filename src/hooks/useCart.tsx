'use client';

import useSWR from 'swr';
import axios from 'axios';
import { getCart } from '@/requests/cart';

interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
}

const useCart = async (sessionId: string) => {
  try {
    const cart = await getCart(sessionId);
    console.log(cart);

    return cart;
  } catch (error) {}
};

export default useCart;
