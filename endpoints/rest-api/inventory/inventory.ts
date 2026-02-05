import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import {
  IInventory,
  IInventoryMovement,
  IInventoryRestock,
  ILowStockItem,
  IRestockInput,
  IAdjustStock,
  ISetReorderLevel,
} from "@/interfaces/inventory/inventory";
import { POST, GET, PUT } from "@/lib/client";
import { logger } from "@/lib/log";

const InventoryBaseURL = `${baseUrl}/inventory`;

export const INVENTORY_API = {
  /**
   * Get inventory by variant ID
   */
  GET_INVENTORY_BY_VARIANT: async (variantId: string): Promise<CustomResponse<IInventory>> => {
    try {
      logger.info(`[INVENTORY_API] Fetching inventory for variant: ${variantId}`);
      const response = await GET(`${InventoryBaseURL}/variant/${variantId}`);
      logger.info(`[INVENTORY_API] Inventory fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error fetching inventory:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch inventory",
        error: true,
      };
    }
  },

  /**
   * Get inventory by product ID
   */
  GET_INVENTORY_BY_PRODUCT: async (productId: string): Promise<CustomResponse<IInventory>> => {
    try {
      logger.info(`[INVENTORY_API] Fetching inventory for product: ${productId}`);
      const response = await GET(`${InventoryBaseURL}/product/${productId}`);
      logger.info(`[INVENTORY_API] Inventory fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error fetching inventory:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch inventory",
        error: true,
      };
    }
  },

  /**
   * Get movements for a variant
   */
  GET_MOVEMENTS_BY_VARIANT: async (
    variantId: string,
    limit?: number
  ): Promise<CustomResponse<IInventoryMovement[]>> => {
    try {
      const url = limit
        ? `${InventoryBaseURL}/variant/${variantId}/movements?limit=${limit}`
        : `${InventoryBaseURL}/variant/${variantId}/movements`;
      logger.info(`[INVENTORY_API] Fetching movements for variant: ${variantId}`);
      const response = await GET(url);
      logger.info(`[INVENTORY_API] Movements fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error fetching movements:", err);
      return {
        data: [] as IInventoryMovement[],
        message: err?.message || "Failed to fetch movements",
        error: true,
      };
    }
  },

  /**
   * Get movements for a product
   */
  GET_MOVEMENTS_BY_PRODUCT: async (
    productId: string,
    limit?: number
  ): Promise<CustomResponse<IInventoryMovement[]>> => {
    try {
      const url = limit
        ? `${InventoryBaseURL}/product/${productId}/movements?limit=${limit}`
        : `${InventoryBaseURL}/product/${productId}/movements`;
      logger.info(`[INVENTORY_API] Fetching movements for product: ${productId}`);
      const response = await GET(url);
      logger.info(`[INVENTORY_API] Movements fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error fetching movements:", err);
      return {
        data: [] as IInventoryMovement[],
        message: err?.message || "Failed to fetch movements",
        error: true,
      };
    }
  },

  /**
   * Get low stock items by vendor ID
   */
  GET_LOW_STOCK_BY_VENDOR: async (vendorId: string): Promise<CustomResponse<ILowStockItem[]>> => {
    try {
      logger.info(`[INVENTORY_API] Fetching low stock items for vendor: ${vendorId}`);
      const response = await GET(`${InventoryBaseURL}/vendor/${vendorId}/low-stock`);
      logger.info(`[INVENTORY_API] Low stock items fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error fetching low stock items:", err);
      return {
        data: [] as ILowStockItem[],
        message: err?.message || "Failed to fetch low stock items",
        error: true,
      };
    }
  },

  /**
   * Record a restock
   */
  RESTOCK: async (
    data: IRestockInput
  ): Promise<CustomResponse<{ inventory: IInventory; restock: IInventoryRestock }>> => {
    try {
      logger.info(`[INVENTORY_API] Recording restock:`, data);
      const response = await POST(`${InventoryBaseURL}/restock`, data);
      logger.info(`[INVENTORY_API] Restock recorded successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error recording restock:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to record restock",
        error: true,
      };
    }
  },

  /**
   * Adjust inventory
   */
  ADJUST: async (data: IAdjustStock): Promise<CustomResponse<IInventory>> => {
    try {
      logger.info(`[INVENTORY_API] Adjusting inventory:`, data);
      const response = await POST(`${InventoryBaseURL}/adjust`, data);
      logger.info(`[INVENTORY_API] Inventory adjusted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error adjusting inventory:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to adjust inventory",
        error: true,
      };
    }
  },

  /**
   * Set reorder level for variant
   */
  SET_REORDER_LEVEL_VARIANT: async (
    variantId: string,
    data: ISetReorderLevel
  ): Promise<CustomResponse<IInventory>> => {
    try {
      logger.info(`[INVENTORY_API] Setting reorder level for variant: ${variantId}`, data);
      const response = await PUT(`${InventoryBaseURL}/variant/${variantId}/reorder-level`, data);
      logger.info(`[INVENTORY_API] Reorder level set successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error setting reorder level:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to set reorder level",
        error: true,
      };
    }
  },

  /**
   * Set reorder level for product
   */
  SET_REORDER_LEVEL_PRODUCT: async (
    productId: string,
    data: ISetReorderLevel
  ): Promise<CustomResponse<IInventory>> => {
    try {
      logger.info(`[INVENTORY_API] Setting reorder level for product: ${productId}`, data);
      const response = await PUT(`${InventoryBaseURL}/product/${productId}/reorder-level`, data);
      logger.info(`[INVENTORY_API] Reorder level set successfully`);
      return response;
    } catch (err: any) {
      logger.error("[INVENTORY_API] Error setting reorder level:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to set reorder level",
        error: true,
      };
    }
  },
};
