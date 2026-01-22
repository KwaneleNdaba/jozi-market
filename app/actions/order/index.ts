'use server';

import { serverGET, serverPOST, serverPUT } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IOrder, ICreateOrder, IUpdateOrder, IRequestReturn, IRequestCancellation, IRequestItemReturn, IVendorOrdersResponse } from '@/interfaces/order/order';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/**
 * Server action to create order from cart
 * Automatically uses the authenticated user's ID from token
 */
export async function createOrderAction(
  orderData: Omit<ICreateOrder, 'userId'>
): Promise<CustomResponse<IOrder>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to create an order.',
        error: true,
      };
    }

    const fullOrderData: ICreateOrder = {
      ...orderData,
      userId: decodedUser.id,
    };

    logger.info('[Order Action] Creating order');
    const response = await serverPOST(`${baseUrl}/order`, fullOrderData);
    logger.info('[Order Action] Order created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error creating order:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create order',
      error: true,
    };
  }
}

/**
 * Server action to get order by ID
 */
export async function getOrderByIdAction(
  id: string
): Promise<CustomResponse<IOrder>> {
  try {
    logger.info('[Order Action] Fetching order by ID:', id);
    const response = await serverGET(`${baseUrl}/order/${id}`);
    logger.info('[Order Action] Order fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error fetching order:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch order',
      error: true,
    };
  }
}

/**
 * Server action to get order by order number
 */
export async function getOrderByOrderNumberAction(
  orderNumber: string
): Promise<CustomResponse<IOrder>> {
  try {
    logger.info('[Order Action] Fetching order by order number:', orderNumber);
    const response = await serverGET(`${baseUrl}/order/number/${orderNumber}`);
    logger.info('[Order Action] Order fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error fetching order:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch order',
      error: true,
    };
  }
}

/**
 * Server action to get my orders
 * Automatically uses the authenticated user's ID from token
 */
export async function getMyOrdersAction(): Promise<CustomResponse<IOrder[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as IOrder[],
        message: 'Authentication required. Please log in to view your orders.',
        error: true,
      };
    }

    logger.info('[Order Action] Fetching my orders');
    const response = await serverGET(`${baseUrl}/order/my-orders`);
    logger.info('[Order Action] Orders fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error fetching orders:', err);
    return {
      data: [] as IOrder[],
      message: err?.message || 'Failed to fetch orders',
      error: true,
    };
  }
}

/**
 * Server action to get orders by vendor ID (grouped by date)
 * Returns orders grouped by date with totals
 */
export async function getOrdersByVendorIdAction(
  vendorId: string
): Promise<CustomResponse<IVendorOrdersResponse>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to view vendor orders.',
        error: true,
      };
    }

    if (!vendorId) {
      return {
        data: null as any,
        message: 'Vendor ID is required',
        error: true,
      };
    }

    logger.info('[Order Action] Fetching orders for vendor:', vendorId);
    const response = await serverGET(`${baseUrl}/order/vendor/${vendorId}`);
    logger.info('[Order Action] Vendor orders fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error fetching vendor orders:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch vendor orders',
      error: true,
    };
  }
}

/**
 * Server action to get all orders (admin only)
 */
export async function getAllOrdersAction(
  status?: string
): Promise<CustomResponse<IOrder[]>> {
  try {
    const url = status
      ? `${baseUrl}/order?status=${encodeURIComponent(status)}`
      : `${baseUrl}/order`;
    
    logger.info('[Order Action] Fetching all orders', status ? `with status: ${status}` : '');
    const response = await serverGET(url);
    logger.info('[Order Action] Orders fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error fetching orders:', err);
    return {
      data: [] as IOrder[],
      message: err?.message || 'Failed to fetch orders',
      error: true,
    };
  }
}

/**
 * Server action to update order (admin only)
 */
export async function updateOrderAction(
  updateData: IUpdateOrder
): Promise<CustomResponse<IOrder>> {
  try {
    logger.info('[Order Action] Updating order:', {
      id: updateData.id,
      status: updateData.status,
      paymentStatus: updateData.paymentStatus,
    });

    const response = await serverPUT(`${baseUrl}/order`, updateData);
    logger.info('[Order Action] Order updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error updating order:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update order',
      error: true,
    };
  }
}

/**
 * Server action to request return (authenticated users only)
 */
export async function requestReturnAction(
  requestData: IRequestReturn
): Promise<CustomResponse<IOrder>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to request a return.',
        error: true,
      };
    }

    logger.info('[Order Action] Requesting return for order:', requestData.orderId);
    const response = await serverPOST(`${baseUrl}/order/return`, requestData);
    logger.info('[Order Action] Return request submitted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error requesting return:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to request return',
      error: true,
    };
  }
}

/**
 * Server action to request cancellation (authenticated users only)
 */
export async function requestCancellationAction(
  requestData: IRequestCancellation
): Promise<CustomResponse<IOrder>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to request a cancellation.',
        error: true,
      };
    }

    logger.info('[Order Action] Requesting cancellation for order:', requestData.orderId);
    const response = await serverPOST(`${baseUrl}/order/cancellation`, requestData);
    logger.info('[Order Action] Cancellation request submitted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error requesting cancellation:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to request cancellation',
      error: true,
    };
  }
}

/**
 * Server action to request item return (authenticated users only)
 * Allows returning specific items from an order with quantity
 */
export async function requestItemReturnAction(
  requestData: IRequestItemReturn
): Promise<CustomResponse<IOrder>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to request an item return.',
        error: true,
      };
    }

    if (!requestData.orderId || !requestData.orderItemId) {
      return {
        data: null as any,
        message: 'Order ID and Order Item ID are required',
        error: true,
      };
    }

    if (!requestData.returnQuantity || requestData.returnQuantity <= 0) {
      return {
        data: null as any,
        message: 'Return quantity must be greater than 0',
        error: true,
      };
    }

    logger.info('[Order Action] Requesting return for order item:', {
      orderId: requestData.orderId,
      orderItemId: requestData.orderItemId,
      returnQuantity: requestData.returnQuantity,
    });
    const response = await serverPOST(`${baseUrl}/order/item/return`, requestData);
    logger.info('[Order Action] Item return request submitted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Order Action] Error requesting item return:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to request item return',
      error: true,
    };
  }
}
