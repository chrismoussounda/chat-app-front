import { SocketContext } from '@/hooks/use-socket';
import { CONSTANT } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(CONSTANT.SOCKET_API_URL);

    socketInstance.on('connect', () => {
      console.log('Real time socket connected');
      setIsConnected(true);
    });
    socketInstance.on('disconnect', () => {
      console.log('Real time socket connected');
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
