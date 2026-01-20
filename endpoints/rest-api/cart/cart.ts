import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { ICart, ICartItem, IAddToCart, IUpdateCartItem } from "@/interfaces/cart/cart";
import { POST, GET, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const CartBaseURL = `${baseUrl}/cart`;

export const CART_API = {
  /**
   * Get cart (authenticated users only)
   */
  GET_CART: async (): Promise<CustomResponse<ICart>> => {
    try {
      logger.info(`[CART_API] Fetching cart`);
      const response = await GET(`${CartBaseURL}`);
      logger.info(`[CART_API] Cart fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[CART_API] Error fetching cart:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch cart",
        error: true,
      };
    }
  },

  /**
   * Add item to cart (authenticated users only)
   */
  ADD_TO_CART: async (itemData: IAddToCart): Promise<CustomResponse<ICartItem>> => {
    try {
      logger.info(`[CART_API] Adding item to cart:`, {
        productId: itemData.productId,
        productVariantId: itemData.productVariantId,
        quantity: itemData.quantity,
      });
      const response = await POST(`${CartBaseURL}/items`, itemData);
      logger.info(`[CART_API] Item added to cart successfully`);
      return response;
    } catch (err: any) {
      logger.error("[CART_API] Error adding item to cart:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to add item to cart",
        error: true,
      };
    }
  },

  /**
   * Update cart item (authenticated users only)
   */
  UPDATE_CART_ITEM: async (updateData: IUpdateCartItem): Promise<CustomResponse<ICartItem>> => {
    try {
      logger.info(`[CART_API] Updating cart item:`, {
        id: updateData.id,
        quantity: updateData.quantity,
      });
      const response = await PUT(`${CartBaseURL}/items`, updateData);
      logger.info(`[CART_API] Cart item updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[CART_API] Error updating cart item:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update cart item",
        error: true,
      };
    }
  },

  /**
   * Remove item from cart (authenticated users only)
   */
  REMOVE_FROM_CART: async (cartItemId: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[CART_API] Removing cart item: ${cartItemId}`);
      const response = await DELETE(`${CartBaseURL}/items/${cartItemId}`);
      logger.info(`[CART_API] Cart item removed successfully`);
      return response;
    } catch (err: any) {
      logger.error("[CART_API] Error removing cart item:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to remove cart item",
        error: true,
      };
    }
  },

  /**
   * Clear cart (authenticated users only)
   */
  CLEAR_CART: async (): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[CART_API] Clearing cart`);
      const response = await DELETE(`${CartBaseURL}`);
      logger.info(`[CART_API] Cart cleared successfully`);
      return response;
    } catch (err: any) {
      logger.error("[CART_API] Error clearing cart:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to clear cart",
        error: true,
      };
    }
  },
};
