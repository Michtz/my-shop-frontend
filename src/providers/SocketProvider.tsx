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

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
  currentUserId: string | null;
}

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Funktion um User Room zu joinen
  const joinUserRoom = (userId: string) => {
    if (socket && userId) {
      socket.emit('user_login', userId);
      setCurrentUserId(userId);
      console.log(`🔐 Joining user room for: ${userId}`);
    }
  };

  // Funktion um User Room zu verlassen
  const leaveUserRoom = (userId: string) => {
    if (socket && userId) {
      socket.emit('user_logout', userId);
      setCurrentUserId(null);
      console.log(`🚪 Leaving user room for: ${userId}`);
    }
  };

  useEffect(() => {
    const initializeSocket = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'https://my-shop-backend-usaq.onrender.com';

      const userInformation = await getCurrentSession();
      const sessionId = userInformation?.data?.sessionId || null;
      const userId = userInformation?.data?.userId || null; // Falls du user ID in session hast

      const socketInstance = io(backendUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      // Connection Events
      socketInstance.on('connect', () => {
        console.log('🔌 Socket connected:', socketInstance.id);
        setIsConnected(true);

        // Join session room
        socketInstance.emit('join_session', sessionId);
        console.log(`🏠 Joined session room: session_${sessionId}`);

        // Auto-join user room if user is logged in
        if (userId) {
          socketInstance.emit('user_login', userId);
          setCurrentUserId(userId);
          console.log(`👤 Auto-joined user room: user_${userId}`);
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
        setIsConnected(false);
        setCurrentUserId(null);
      });

      // User Room Events
      socketInstance.on('user_room_joined', (data: { userId: string }) => {
        console.log('✅ Successfully joined user room:', data.userId);
        setCurrentUserId(data.userId);
      });

      // User-spezifische Events
      socketInstance.on('order_status_updated', (data: any) => {
        console.log('📦 Order status updated:', data);

        // Hier kannst du deine Order UI aktualisieren
        mutate('orders');
        mutate('/api/orders');
        if (data.orderId) {
          mutate(`order-${data.orderId}`);
        }
      });

      socketInstance.on('notification', (data: any) => {
        console.log('🔔 New notification:', data);
        // todo: if time add a banner for something like a new product so all user can see a notification or something like this
      });

      socketInstance.on(
        'products_updated',
        (data: { productIds: string[]; timestamp: string }) => {
          console.log('🔄 PRODUCTS UPDATED EVENT:', data);
          mutate('products'); // for card list view update
          data.productIds.forEach((productId: string) => {
            mutate(productId); // Für for single product update
          });
        },
      );

      socketInstance.on(
        'cart_updated',
        (data: {
          productId: string;
          timestamp: string;
          sessionId: string;
          userId?: string;
        }) => {
          console.log('user cart updated:', data);

          console.log('user cart updated:', data, userId, sessionId);
          if (data.userId) {
            mutate(`cart-${data.userId}`);
          } else {
            mutate(`cart-${data.sessionId}`);
          }
        },
      );

      setSocket(socketInstance);

      return () => {
        // Cleanup beim Unmount
        if (userId) {
          socketInstance.emit('user_logout', userId);
        }
        socketInstance.disconnect();
      };
    };

    initializeSocket();
  }, []);

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    joinUserRoom,
    leaveUserRoom,
    currentUserId,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
