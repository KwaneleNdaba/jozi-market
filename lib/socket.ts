import { io, Socket } from 'socket.io-client';

const mylocalUrl = 'http://localhost:8000';
const SOCKET_URL = process.env.NEXT_PUBLIC_URL ?? mylocalUrl;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    console.log('[Socket] Initializing connection to:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] ✅ Connected successfully! Socket ID:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] ❌ Disconnected. Reason:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] ⚠️ Connection error:', error.message);
    });
    
    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] 🔄 Reconnected after', attemptNumber, 'attempts');
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[Socket] 🔄 Attempting to reconnect... Attempt:', attemptNumber);
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
  console.log('[Socket] 📡 Subscribed to product:', productId);
};

// Unsubscribe from product updates
export const unsubscribeFromProduct = (productId: string): void => {
  const socket = getSocket();
  socket.emit('unsubscribe:product', productId);
  console.log('[Socket] 📴 Unsubscribed from product:', productId);
};

// Subscribe to variant updates
export const subscribeToVariant = (variantId: string): void => {
  const socket = getSocket();
  socket.emit('subscribe:variant', variantId);
  console.log('[Socket] 📡 Subscribed to variant:', variantId);
};

// Unsubscribe from variant updates
export const unsubscribeFromVariant = (variantId: string): void => {
  const socket = getSocket();
  socket.emit('unsubscribe:variant', variantId);
  console.log('[Socket] 📴 Unsubscribed from variant:', variantId);
};

// Listen to stock updates
export const onStockUpdate = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  
  const wrappedCallback = (data: any) => {
    console.log('[Socket] 📦 Stock update received:', data);
    callback(data);
  };
  
  socket.on('stock:update', wrappedCallback);
  console.log('[Socket] 👂 Listening for stock:update events');
  
  // Return cleanup function
  return () => {
    socket.off('stock:update', wrappedCallback);
    console.log('[Socket] 🔇 Stopped listening for stock:update events');
  };
};
