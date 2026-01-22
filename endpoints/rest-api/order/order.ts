import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IOrder, ICreateOrder, IUpdateOrder, IRequestReturn, IRequestCancellation, IRequestItemReturn, IVendorOrdersResponse } from "@/interfaces/order/order";
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

  /**
   * Request return (authenticated users only)
   */
  REQUEST_RETURN: async (requestData: IRequestReturn): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Requesting return for order: ${requestData.orderId}`);
      const response = await POST(`${OrderBaseURL}/return`, requestData);
      logger.info(`[ORDER_API] Return request submitted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error requesting return:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to request return",
        error: true,
      };
    }
  },

  /**
   * Request cancellation (authenticated users only)
   */
  REQUEST_CANCELLATION: async (requestData: IRequestCancellation): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Requesting cancellation for order: ${requestData.orderId}`);
      const response = await POST(`${OrderBaseURL}/cancellation`, requestData);
      logger.info(`[ORDER_API] Cancellation request submitted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error requesting cancellation:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to request cancellation",
        error: true,
      };
    }
  },

  /**
   * Get orders by vendor ID (grouped by date) (authenticated users only)
   */
  GET_ORDERS_BY_VENDOR_ID: async (vendorId: string): Promise<CustomResponse<IVendorOrdersResponse>> => {
    try {
      logger.info(`[ORDER_API] Fetching orders for vendor: ${vendorId}`);
      const response = await GET(`${OrderBaseURL}/vendor/${vendorId}`);
      logger.info(`[ORDER_API] Vendor orders fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error fetching vendor orders:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch vendor orders",
        error: true,
      };
    }
  },

  /**
   * Request item return (authenticated users only)
   * Allows returning specific items from an order with quantity
   */
  REQUEST_ITEM_RETURN: async (requestData: IRequestItemReturn): Promise<CustomResponse<IOrder>> => {
    try {
      logger.info(`[ORDER_API] Requesting return for order item: ${requestData.orderItemId} from order: ${requestData.orderId}`);
      const response = await POST(`${OrderBaseURL}/item/return`, requestData);
      logger.info(`[ORDER_API] Item return request submitted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[ORDER_API] Error requesting item return:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to request item return",
        error: true,
      };
    }
  },
};
