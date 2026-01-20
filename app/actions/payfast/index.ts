'use server';

import { serverGET, serverPOST } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { PaymentRequest, PaymentResponse, PaymentStatusResponse } from '@/interfaces/payfast/payfast';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/**
 * Server action to generate payment URL from cart
 * Automatically uses the authenticated user's ID from token
 * Email and phone are required and will be passed to PayFast
 */
export async function generatePaymentAction(
  request: Omit<PaymentRequest, 'userId'> & { email: string; phone?: string; fullName?: string; deliveryAddress?: PaymentRequest['deliveryAddress'] }
): Promise<CustomResponse<PaymentResponse>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to generate payment.',
        error: true,
      };
    }

    const fullRequest: PaymentRequest = {
      ...request,
      userId: decodedUser.id,
    };

    logger.info('[PayFast Action] Generating payment for user:', decodedUser.id);
    const response = await serverPOST(`${baseUrl}/payfast/generate-payment`, fullRequest);
    logger.info('[PayFast Action] Payment URL generated successfully');
    return response;
  } catch (err: any) {
    logger.error('[PayFast Action] Error generating payment:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to generate payment',
      error: true,
    };
  }
}

/**
 * Server action to handle PayFast ITN webhook
 * Note: This is typically called by PayFast, not directly by the frontend
 */
export async function handleITNAction(
  itnData: any
): Promise<CustomResponse<{
  success: boolean;
  order?: any;
  message: string;
}>> {
  try {
    logger.info('[PayFast Action] Handling ITN notification');
    const response = await serverPOST(`${baseUrl}/payfast/notification`, itnData);
    logger.info('[PayFast Action] ITN handled successfully');
    return response;
  } catch (err: any) {
    logger.error('[PayFast Action] Error handling ITN:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to handle ITN',
      error: true,
    };
  }
}

/**
 * Server action to check payment status
 */
export async function checkPaymentStatusAction(
  paymentReference: string
): Promise<CustomResponse<PaymentStatusResponse>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to check payment status.',
        error: true,
      };
    }

    logger.info('[PayFast Action] Checking payment status for:', paymentReference);
    const response = await serverGET(`${baseUrl}/payfast/status/${paymentReference}`);
    logger.info('[PayFast Action] Payment status checked successfully');
    return response;
  } catch (err: any) {
    logger.error('[PayFast Action] Error checking payment status:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to check payment status',
      error: true,
    };
  }
}
