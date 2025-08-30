'use client';

import { useSocketContext } from '@/providers/SocketProvider';
import { SocketContextType } from '@/types/socket.types';

interface UseSocketResponse extends SocketContextType {
  isReady: boolean;
}

const useSocket = (): UseSocketResponse => {
  const socketContext = useSocketContext();

  return {
    ...socketContext,
    isReady: socketContext.isConnected && socketContext.socket !== null,
  };
};

export default useSocket;
