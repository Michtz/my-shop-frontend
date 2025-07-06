'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import {
  IProduct,
  ProductFilters,
  ProductResponse,
} from '@/types/product.types';
import useSocket from '@/hooks/useSocket';

interface ProductWithSocketData extends IProduct {
  cartCount?: number;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  lastStockUpdate?: Date;
}

interface ProductsResponse {
  products: ProductWithSocketData[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lowStockProducts: ProductWithSocketData[];
  outOfStockProducts: ProductWithSocketData[];
  totalCartCount: number;
}

const useProducts = (): ProductsResponse => {
  const { isConnected, isReady } = useSocket();
  const [cartCounts, setCartCounts] = useState<{ [productId: string]: number }>(
    {},
  );

  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    'products',
    () => getProducts(),
    {
      suspense: false,
      refreshInterval: 60000,
    },
  );

  const processProducts = (): ProductWithSocketData[] => {
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
    (data && !data.success ? data.error || 'Unbekannter Fehler' : null);

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
