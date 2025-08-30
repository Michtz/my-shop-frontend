'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { mutate } from 'swr';

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<any>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://my-shop-backend-usaq.onrender.com';

    console.log('🔌 Connecting socket to:', backendUrl);

    const socketInstance = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    // Connection Events
    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance.id);
      setIsConnected(true);
      // Auto-joins shop_updates room on backend
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on(
      'products_updated',
      (data: { productIds: string[]; timestamp: string }) => {
        console.log('🔄 PRODUCTS UPDATED EVENT:', data);
        console.log(
          `📦 ${data.productIds.length} products were updated at ${data.timestamp}`,
        );
        console.log('📋 Product IDs:', data.productIds);

        // Mutate SWR cache for products
        mutate('products');
        mutate('/api/products');

        // If specific product IDs, mutate them individually
        if (data.productIds && data.productIds.length > 0) {
          data.productIds.forEach((productId: string) => {
            mutate(`product-${productId}`);
            mutate(`/api/products/${productId}`);
          });
        }
      },
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const contextValue = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
