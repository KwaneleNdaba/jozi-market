import { io, Socket } from 'socket.io-client';

const mylocalUrl = 'http://localhost:8000';
const SOCKET_URL = process.env.NEXT_PUBLIC_URL ?? mylocalUrl;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Disconnected and cleared');
  }
};

// Subscribe to product updates
export const subscribeToProduct = (productId: string): void => {
  const socket = getSocket();
  socket.emit('subscribe:product', productId);
  console.log('[Socket] Subscribed to product:', productId);
};

// Unsubscribe from product updates
export const unsubscribeFromProduct = (productId: string): void => {
  const socket = getSocket();
  socket.emit('unsubscribe:product', productId);
  console.log('[Socket] Unsubscribed from product:', productId);
};

// Subscribe to variant updates
export const subscribeToVariant = (variantId: string): void => {
  const socket = getSocket();
  socket.emit('subscribe:variant', variantId);
  console.log('[Socket] Subscribed to variant:', variantId);
};

// Unsubscribe from variant updates
export const unsubscribeFromVariant = (variantId: string): void => {
  const socket = getSocket();
  socket.emit('unsubscribe:variant', variantId);
  console.log('[Socket] Unsubscribed from variant:', variantId);
};

// Listen to stock updates
export const onStockUpdate = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('stock:update', callback);
  
  // Return cleanup function
  return () => {
    socket.off('stock:update', callback);
  };
};
