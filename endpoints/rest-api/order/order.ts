import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IOrder, ICreateOrder, IUpdateOrder } from "@/interfaces/order/order";
import { POST, GET, PUT } from "@/lib/client";
import { logger } from "@/lib/log";

const OrderBaseURL = `${baseUrl}/order`;

export const ORDER_API = {
  /**
   * Create order from cart (authenticated users only)
   */
  CREATE_ORDER: async (orderData: ICreateOrder): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Creating order`);
      const response = await POST(`${OrderBaseURL}`, orderData);
      logger.info(`[ORDER_API] Order created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error creating order:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create order",
        error: true,
      };
    }
  },

  /**
   * Get order by ID (authenticated users only - can access own orders)
   */
  GET_ORDER_BY_ID: async (id: string): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Fetching order by ID: ${id}`);
      const response = await GET(`${OrderBaseURL}/${id}`);
      logger.info(`[ORDER_API] Order fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error fetching order:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch order",
        error: true,
      };
    }
  },

  /**
   * Get order by order number (authenticated users only)
   */
  GET_ORDER_BY_ORDER_NUMBER: async (orderNumber: string): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Fetching order by order number: ${orderNumber}`);
      const response = await GET(`${OrderBaseURL}/number/${orderNumber}`);
      logger.info(`[ORDER_API] Order fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error fetching order:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch order",
        error: true,
      };
    }
  },

  /**
   * Get my orders (authenticated users only)
   */
  GET_MY_ORDERS: async (): Promise<CustomResponse<IOrder[]>> => {
    try {
      logger.info(`[ORDER_API] Fetching my orders`);
      const response = await GET(`${OrderBaseURL}/my-orders`);
      logger.info(`[ORDER_API] Orders fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error fetching orders:", err);
      return {
        data: [] as IOrder[],
        message: err?.message || "Failed to fetch orders",
        error: true,
      };
    }
  },

  /**
   * Get all orders (admin only)
   */
  GET_ALL_ORDERS: async (status?: string): Promise<CustomResponse<IOrder[]>> => {
    try {
      const url = status
        ? `${OrderBaseURL}?status=${encodeURIComponent(status)}`
        : `${OrderBaseURL}`;
      logger.info(`[ORDER_API] Fetching all orders${status ? ` with status: ${status}` : ''}`);
      const response = await GET(url);
      logger.info(`[ORDER_API] Orders fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error fetching orders:", err);
      return {
        data: [] as IOrder[],
        message: err?.message || "Failed to fetch orders",
        error: true,
      };
    }
  },

  /**
   * Update order (admin only)
   */
  UPDATE_ORDER: async (updateData: IUpdateOrder): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Updating order:`, {
        id: updateData.id,
        status: updateData.status,
        paymentStatus: updateData.paymentStatus,
      });
      const response = await PUT(`${OrderBaseURL}`, updateData);
      logger.info(`[ORDER_API] Order updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error updating order:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update order",
        error: true,
      };
    }
  },
};
