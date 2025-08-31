'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { IProduct, ProductResponse } from '@/types/product.types';
import useSocket from '@/hooks/SocketHook';

/*
 * this hook is used to handle data of all products
 */

interface ProductsResponse {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lowStockProducts: IProduct[];
  outOfStockProducts: IProduct[];
  totalCartCount: number;
}

const useProducts = (): ProductsResponse => {
  const { isConnected } = useSocket();
  const [cartCounts] = useState<{ [productId: string]: number }>({});

  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    'products',
    () => getProducts(),
    {
      suspense: false,
      refreshInterval: 60000,
    },
  );

  const processProducts = (): IProduct[] => {
    if (!data?.data) return [];

    return (data.data as IProduct[]).map((product) => {
      const availableStock =
        product.availableQuantity ?? product.stockQuantity ?? 0;
      const isLowStock = availableStock > 0 && availableStock <= 5;
      const isOutOfStock = availableStock <= 0;

      return {
        ...product,
        cartCount: cartCounts[product._id] || 0,
        isLowStock,
        isOutOfStock,
        lastStockUpdate: new Date(),
      };
    });
  };

  const processedProducts = processProducts();
  const lowStockProducts = processedProducts.filter((p) => p.isLowStock);
  const outOfStockProducts = processedProducts.filter((p) => p.isOutOfStock);
  const totalCartCount = Object.values(cartCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  const errorMessage: string | null =
    error?.message ||
    (data && !data.success ? data.error || 'unknown error' : null);

  return {
    products: processedProducts,
    isLoading,
    error: errorMessage,
    isConnected,
    lowStockProducts,
    outOfStockProducts,
    totalCartCount,
  };
};

export default useProducts;
