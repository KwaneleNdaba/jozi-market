'use server';

import { serverGET, serverPOST, serverPUT } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IOrder, ICreateOrder, IUpdateOrder } from '@/interfaces/order/order';
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
