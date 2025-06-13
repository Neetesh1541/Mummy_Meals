import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) {
      // Disconnect if user is not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server via Socket.IO');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for new orders (for moms)
    newSocket.on('new_order', (data) => {
      console.log('📱 New order received:', data);
      toast.success('New order received!', {
        icon: '🔔',
        duration: 5000,
      });
      
      // Play notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {
          // Fallback: use system notification sound
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Order!', {
              body: data.message,
              icon: '/favicon.ico'
            });
          }
        });
      } catch (error) {
        console.log('Could not play notification sound:', error);
      }

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('new_order', { detail: data }));
    });

    // Listen for order status updates
    newSocket.on('order_status_update', (data) => {
      console.log('📱 Order status update:', data);
      toast.success(data.message, {
        icon: '📋',
        duration: 3000,
      });

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('order_status_update', { detail: data }));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user, token]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 