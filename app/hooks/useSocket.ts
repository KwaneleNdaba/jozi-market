'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getSocket, subscribeToProduct, unsubscribeFromProduct, onStockUpdate } from '@/lib/socket';

interface StockUpdateData {
  type: 'product' | 'variant';
  productId?: string;
  variantId?: string;
  quantityAvailable?: number;
  quantityReserved?: number;
  stock?: number;
  status?: string;
}

/**
 * Hook for subscribing to real-time product updates
 * @param productId - The product ID to subscribe to
 * @param onUpdate - Callback function when stock updates are received
 */
export const useProductSocket = (
  productId: string | undefined,
  onUpdate: (data: StockUpdateData) => void
) => {
  const callbackRef = useRef(onUpdate);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!productId) return;

    // Initialize socket connection
    getSocket();

    // Subscribe to product updates
    subscribeToProduct(productId);

    // Set up listener for stock updates
    const cleanup = onStockUpdate((data: StockUpdateData) => {
      // Only process updates for this specific product
      if (data.productId === productId || data.type === 'product') {
        console.log('[useProductSocket] Stock update received:', data);
        callbackRef.current(data);
      }
    });

    // Cleanup on unmount
    return () => {
      cleanup();
      unsubscribeFromProduct(productId);
    };
  }, [productId]);
};

/**
 * Hook for subscribing to real-time updates for multiple products
 * @param productIds - Array of product IDs to subscribe to
 * @param onUpdate - Callback function when stock updates are received
 */
export const useProductsSocket = (
  productIds: string[],
  onUpdate: (data: StockUpdateData) => void
) => {
  const callbackRef = useRef(onUpdate);
  const previousIdsRef = useRef<string[]>([]);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!productIds || productIds.length === 0) return;

    // Initialize socket connection
    getSocket();

    // Subscribe to all products
    productIds.forEach(id => {
      if (id) subscribeToProduct(id);
    });

    // Set up listener for stock updates
    const cleanup = onStockUpdate((data: StockUpdateData) => {
      // Process updates for any of the subscribed products
      if (data.productId && productIds.includes(data.productId)) {
        console.log('[useProductsSocket] Stock update received:', data);
        callbackRef.current(data);
      }
    });

    // Store current IDs
    previousIdsRef.current = productIds;

    // Cleanup on unmount or when product IDs change
    return () => {
      cleanup();
      previousIdsRef.current.forEach(id => {
        if (id) unsubscribeFromProduct(id);
      });
    };
  }, [productIds.join(',')]); // Use join to create stable dependency
};
