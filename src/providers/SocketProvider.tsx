import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { mutate } from 'swr';
import { getCurrentSession } from '@/requests/session.request';

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
    const initializeSocket = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'https://my-shop-backend-usaq.onrender.com';

      const userInformation = await getCurrentSession();
      const sessionId = userInformation.data.sessionId || null;
      const socketInstance = io(backendUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      // Connection Events
      socketInstance.on('connect', () => {
        console.log('🔌 Socket connected:', socketInstance.id);
        setIsConnected(true);

        socketInstance.emit('join_session', sessionId);
        console.log(`🏠 Joined session room: session_${sessionId}`);
        // Auto-joins shop_updates room on backend
      });

      socketInstance.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
        setIsConnected(false);
      });

      socketInstance.on(
        // ToDo: check what is still in use and whats old
        'products_updated',
        (data: { productIds: string[]; timestamp: string }) => {
          console.log('🔄 PRODUCTS UPDATED EVENT:', data);

          mutate('products');
          mutate('/api/products');
          data.productIds.forEach((productId: string) => {
            mutate(productId);
          });

          // If specific product IDs, mutate them individually
          if (data.productIds && data.productIds.length > 0) {
            data.productIds.forEach((productId: string) => {
              mutate(`product-${productId}`);
              mutate(`/api/products/${productId}`);
            });
          }
        },
      );

      socketInstance.on(
        'cart_updated',
        (data: { productId: string; timestamp: string }) => {
          mutate(`cart-${sessionId}`);
        },
      );

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    };
    initializeSocket();
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
