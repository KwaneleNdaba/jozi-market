'use server';

import { serverGET, serverPOST, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { ICart, ICartItem, IAddToCart, IUpdateCartItem } from '@/interfaces/cart/cart';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/**
 * Server action to get cart
 * Automatically uses the authenticated user's ID from token
 */
export async function getCartAction(): Promise<CustomResponse<ICart>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to view your cart.',
        error: true,
      };
    }

    logger.info('[Cart Action] Fetching cart');
    const response = await serverGET(`${baseUrl}/cart`);
    logger.info('[Cart Action] Cart fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Cart Action] Error fetching cart:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch cart',
      error: true,
    };
  }
}

/**
 * Server action to add item to cart
 * Automatically uses the authenticated user's ID from token
 */
export async function addToCartAction(
  itemData: IAddToCart
): Promise<CustomResponse<ICartItem>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to add items to cart.',
        error: true,
      };
    }

    logger.info('[Cart Action] Adding item to cart:', {
      productId: itemData.productId,
      productVariantId: itemData.productVariantId,
      quantity: itemData.quantity,
    });

    const response = await serverPOST(`${baseUrl}/cart/items`, itemData);
    logger.info('[Cart Action] Item added to cart successfully');
    return response;
  } catch (err: any) {
    logger.error('[Cart Action] Error adding item to cart:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to add item to cart',
      error: true,
    };
  }
}

/**
 * Server action to update cart item
 * Automatically uses the authenticated user's ID from token
 */
export async function updateCartItemAction(
  updateData: IUpdateCartItem
): Promise<CustomResponse<ICartItem>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to update cart items.',
        error: true,
      };
    }

    logger.info('[Cart Action] Updating cart item:', {
      id: updateData.id,
      quantity: updateData.quantity,
    });

    const response = await serverPUT(`${baseUrl}/cart/items`, updateData);
    logger.info('[Cart Action] Cart item updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Cart Action] Error updating cart item:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update cart item',
      error: true,
    };
  }
}

/**
 * Server action to remove item from cart
 * Automatically uses the authenticated user's ID from token
 */
export async function removeFromCartAction(
  cartItemId: string
): Promise<CustomResponse<void>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to remove items from cart.',
        error: true,
      };
    }

    logger.info('[Cart Action] Removing cart item:', cartItemId);
    const response = await serverDELETE(`${baseUrl}/cart/items/${cartItemId}`);
    logger.info('[Cart Action] Cart item removed successfully');
    return response;
  } catch (err: any) {
    logger.error('[Cart Action] Error removing cart item:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to remove cart item',
      error: true,
    };
  }
}

/**
 * Server action to clear cart
 * Automatically uses the authenticated user's ID from token
 */
export async function clearCartAction(): Promise<CustomResponse<void>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to clear your cart.',
        error: true,
      };
    }

    logger.info('[Cart Action] Clearing cart');
    const response = await serverDELETE(`${baseUrl}/cart`);
    logger.info('[Cart Action] Cart cleared successfully');
    return response;
  } catch (err: any) {
    logger.error('[Cart Action] Error clearing cart:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to clear cart',
      error: true,
    };
  }
}
