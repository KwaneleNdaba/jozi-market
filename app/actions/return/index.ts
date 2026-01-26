'use server';

import { serverGET, serverPOST, serverPUT } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import type {
  IReturn,
  IReturnItem,
  ICreateReturn,
  ICreateReturnItemInput,
  IReviewReturn,
  IReviewReturnItem,
} from '@/interfaces/return/return';
import type { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/** Create return request (authenticated). Body: orderId, reason, items. userId from token. */
export async function createReturnAction(payload: {
  orderId: string;
  reason: string;
  items: ICreateReturnItemInput[];
}): Promise<CustomResponse<IReturn>> {
  try {
    const decoded = await decodeServerAccessToken();
    if (!decoded?.id) {
      return { data: null as any, message: 'Authentication required.', error: true };
    }
    logger.info('[Return Action] Creating return', { orderId: payload.orderId });
    const response = await serverPOST(`${baseUrl}/return`, payload);
    logger.info('[Return Action] Return created');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Create error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to create return',
      error: true,
    };
  }
}

/** Get current user's returns. */
export async function getMyReturnsAction(): Promise<CustomResponse<IReturn[]>> {
  try {
    const decoded = await decodeServerAccessToken();
    if (!decoded?.id) {
      return { data: [], message: 'Authentication required.', error: true };
    }
    logger.info('[Return Action] Fetching my returns');
    const response = await serverGET(`${baseUrl}/return/my-returns`);
    logger.info('[Return Action] My returns fetched');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Get my returns error:', err);
    return {
      data: [],
      message: err?.message ?? 'Failed to fetch returns',
      error: true,
    };
  }
}

/** Get return by ID (own or admin). */
export async function getReturnByIdAction(id: string): Promise<CustomResponse<IReturn>> {
  try {
    if (!id) {
      return { data: null as any, message: 'Return ID required.', error: true };
    }
    logger.info('[Return Action] Fetching return by ID', id);
    const response = await serverGET(`${baseUrl}/return/${id}`);
    logger.info('[Return Action] Return fetched');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Get by ID error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to fetch return',
      error: true,
    };
  }
}

/** Get all returns (admin). Optional ?status= filter. */
export async function getAllReturnsAction(status?: string): Promise<CustomResponse<IReturn[]>> {
  try {
    const url = status
      ? `${baseUrl}/return?status=${encodeURIComponent(status)}`
      : `${baseUrl}/return`;
    logger.info('[Return Action] Fetching all returns', status ? `status=${status}` : '');
    const response = await serverGET(url);
    logger.info('[Return Action] All returns fetched');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Get all error:', err);
    return {
      data: [],
      message: err?.message ?? 'Failed to fetch returns',
      error: true,
    };
  }
}

/** Review return (admin). Approve or reject. */
export async function reviewReturnAction(
  payload: IReviewReturn
): Promise<CustomResponse<IReturn>> {
  try {
    logger.info('[Return Action] Reviewing return', payload.returnId);
    const response = await serverPUT(`${baseUrl}/return/review`, payload);
    logger.info('[Return Action] Return reviewed');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Review error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to review return',
      error: true,
    };
  }
}

/** Review return item (admin). */
export async function reviewReturnItemAction(
  payload: IReviewReturnItem
): Promise<CustomResponse<IReturnItem>> {
  try {
    logger.info('[Return Action] Reviewing return item', payload.returnItemId);
    const response = await serverPUT(`${baseUrl}/return/item/review`, payload);
    logger.info('[Return Action] Return item reviewed');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Review item error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to review return item',
      error: true,
    };
  }
}

/** Update return status (admin). */
export async function updateReturnStatusAction(
  returnId: string,
  status: string
): Promise<CustomResponse<IReturn>> {
  try {
    if (!returnId || !status) {
      return { data: null as any, message: 'Return ID and status required.', error: true };
    }
    logger.info('[Return Action] Updating return status', { returnId, status });
    const response = await serverPUT(`${baseUrl}/return/${returnId}/status`, { status });
    logger.info('[Return Action] Return status updated');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Update status error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to update return status',
      error: true,
    };
  }
}

/** Update return item status (admin). */
export async function updateReturnItemStatusAction(
  returnItemId: string,
  status: string
): Promise<CustomResponse<IReturnItem>> {
  try {
    if (!returnItemId || !status) {
      return { data: null as any, message: 'Return item ID and status required.', error: true };
    }
    logger.info('[Return Action] Updating return item status', { returnItemId, status });
    const response = await serverPUT(`${baseUrl}/return/item/${returnItemId}/status`, { status });
    logger.info('[Return Action] Return item status updated');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Update item status error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to update return item status',
      error: true,
    };
  }
}

/** Cancel return (customer; own returns only). */
export async function cancelReturnAction(returnId: string): Promise<CustomResponse<IReturn>> {
  try {
    const decoded = await decodeServerAccessToken();
    if (!decoded?.id) {
      return { data: null as any, message: 'Authentication required.', error: true };
    }
    if (!returnId) {
      return { data: null as any, message: 'Return ID required.', error: true };
    }
    logger.info('[Return Action] Cancelling return', returnId);
    const response = await serverPUT(`${baseUrl}/return/${returnId}/cancel`, {});
    logger.info('[Return Action] Return cancelled');
    return response;
  } catch (err: any) {
    logger.error('[Return Action] Cancel error:', err);
    return {
      data: null as any,
      message: err?.message ?? 'Failed to cancel return',
      error: true,
    };
  }
}
