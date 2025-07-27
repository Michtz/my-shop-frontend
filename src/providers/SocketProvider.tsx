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
import { useAuth } from '@/hooks/AuthHook';
import {
  SocketContextType,
  CartReservationData,
  CartUpdateData,
  CartSyncData,
  StockConflictData,
  ProductStockData,
  ProductReservationInfo,
  ReservationExpiredData,
  LowStockAlert,
  OutOfStockAlert,
} from '@/types/socket.types';

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { sessionData, userSessionData } = useAuth();

  // Socket Connection
  useEffect(() => {
    if (!sessionData?.sessionId) return;

    const socketInstance = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4200',
      {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      },
    );

    // Connection Events
    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance.id);
      setIsConnected(true);

      // Auto-join session room
      socketInstance.emit('join_session', sessionData.sessionId);

      // Auto-join user room if logged in
      if (userSessionData?.user.id) {
        socketInstance.emit('join_user', userSessionData?.user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    // Setup Socket Event Listeners
    setupSocketEventListeners(socketInstance);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.sessionId, userSessionData?.user.id]);

  // Socket Event Listeners
  const setupSocketEventListeners = (socketInstance: Socket) => {
    // Cart Events
    socketInstance.on('cart_item_reserved', (data: CartReservationData) => {
      console.log('🔒 Cart item reserved:', data);
      mutateCartData(data.sessionId);
      mutateProductData(data.productId);
    });

    socketInstance.on('cart_item_released', (data: CartReservationData) => {
      console.log('🔓 Cart item released:', data);
      mutateCartData(data.sessionId);
      mutateProductData(data.productId);
    });

    socketInstance.on('cart_updated', (data: CartUpdateData) => {
      console.log('🛒 Cart updated:', data);
      mutateCartData(data.sessionId);
    });

    socketInstance.on('cart_synced', (data: CartSyncData) => {
      console.log('🔄 Cart synced:', data);
      if (sessionData?.sessionId) {
        mutateCartData(sessionData.sessionId);
      }
    });

    socketInstance.on('cart_stock_conflict', (data: StockConflictData) => {
      console.log('⚠️ Stock conflict:', data);
      // TODO: Add user feedback/notification here
      mutateProductData(data.productId);
    });

    // Product Events
    socketInstance.on('product_reserved', (data: ProductReservationInfo) => {
      console.log('📦 Product reserved:', data);
      mutateProductData(data.productId);
    });

    socketInstance.on('product_released', (data: ProductReservationInfo) => {
      console.log('📦 Product released:', data);
      mutateProductData(data.productId);
    });

    socketInstance.on('product_stock_updated', (data: ProductStockData) => {
      console.log('📊 Product stock updated:', data);
      mutateProductData(data.productId);
      mutate('products'); // Update products list
    });

    socketInstance.on('category_stock_updated', (data: ProductStockData) => {
      console.log('🏷️ Category stock updated:', data);
      mutateProductData(data.productId);
      mutate('products');
    });

    socketInstance.on('stock_updated', (data: ProductStockData) => {
      console.log('📈 Stock updated:', data);
      mutateProductData(data.productId);
      mutate('products');
    });

    socketInstance.on('reservation_expired', (data: ReservationExpiredData) => {
      console.log('⏰ Reservation expired:', data);
      if (sessionData?.sessionId) {
        mutateCartData(sessionData.sessionId);
      }
      mutateProductData(data.productId);
    });

    // Stock Alerts
    socketInstance.on('low_stock_alert', (data: LowStockAlert) => {
      console.log('🟡 Low stock alert:', data);
      mutateProductData(data.productId);
    });

    socketInstance.on('out_of_stock_alert', (data: OutOfStockAlert) => {
      console.log('🔴 Out of stock alert:', data);
      mutateProductData(data.productId);
    });
  };

  // SWR Cache Mutation Helpers
  const mutateCartData = (sessionId: string) => {
    mutate(`cart-${sessionId}`);
  };

  const mutateProductData = (productId: string) => {
    mutate(productId); // Single product
    mutate('products'); // Products list
  };

  // Room Management Functions
  const joinSession = (sessionId: string) => {
    if (socket) {
      socket.emit('join_session', sessionId);
    }
  };

  const leaveSession = (sessionId: string) => {
    if (socket) {
      socket.emit('leave_session', sessionId);
    }
  };

  const joinUser = (userId: string) => {
    if (socket) {
      socket.emit('join_user', userId);
    }
  };

  const leaveUser = (userId: string) => {
    if (socket) {
      socket.emit('leave_user', userId);
    }
  };

  const watchProduct = (productId: string) => {
    if (socket) {
      socket.emit('watch_product', productId);
    }
  };

  const unwatchProduct = (productId: string) => {
    if (socket) {
      socket.emit('unwatch_product', productId);
    }
  };

  const watchCategory = (category: string) => {
    if (socket) {
      socket.emit('watch_category', category);
    }
  };

  const unwatchCategory = (category: string) => {
    if (socket) {
      socket.emit('unwatch_category', category);
    }
  };

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    joinSession,
    leaveSession,
    joinUser,
    leaveUser,
    watchProduct,
    unwatchProduct,
    watchCategory,
    unwatchCategory,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
