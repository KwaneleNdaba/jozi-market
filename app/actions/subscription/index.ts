'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import {
  ISubscriptionPlan,
  ICreateSubscriptionPlan,
  IUpdateSubscriptionPlan,
  ISubscriptionFeature,
  ICreateSubscriptionFeature,
  IUpdateSubscriptionFeature,
  IUserSubscription,
  ICreateUserSubscription,
  IUpdateUserSubscription,
  ISubscriptionTransaction,
  ISubscriptionPaymentRequest,
  ISubscriptionPaymentResponse,
} from '@/interfaces/subscription/subscription';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

const SubscriptionPlanBaseURL = `${baseUrl}/subscription-plan`;
const SubscriptionFeatureBaseURL = `${baseUrl}/subscription-feature`;
const UserSubscriptionBaseURL = `${baseUrl}/user-subscription`;
const SubscriptionTransactionBaseURL = `${baseUrl}/subscription-transaction`;

// ==================== SUBSCRIPTION PLAN ACTIONS ====================

/**
 * Server action to create a subscription plan (admin only)
 */
export async function createSubscriptionPlanAction(
  planData: ICreateSubscriptionPlan
): Promise<CustomResponse<ISubscriptionPlan>> {
  try {
    logger.info('[Subscription Plan Action] Creating plan:', {
      name: planData.name,
      duration: planData.duration,
      price: planData.price,
    });

    const response = await serverPOST(`${SubscriptionPlanBaseURL}`, planData);
    
    logger.info('[Subscription Plan Action] Plan created successfully:', {
      id: response?.data?.id,
      name: response?.data?.name,
    });

    return response;
  } catch (err: any) {
    logger.error('[Subscription Plan Action] Error creating plan:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create subscription plan',
      error: true,
    };
  }
}

/**
 * Server action to get subscription plan by ID (public)
 */
export async function getSubscriptionPlanByIdAction(
  id: string
): Promise<CustomResponse<ISubscriptionPlan>> {
  try {
    logger.info('[Subscription Plan Action] Fetching plan by ID:', id);
    const response = await serverGET(`${SubscriptionPlanBaseURL}/${id}`);
    logger.info('[Subscription Plan Action] Plan fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Plan Action] Error fetching plan:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch subscription plan',
      error: true,
    };
  }
}

/**
 * Server action to get all subscription plans with optional status filter (public)
 */
export async function getAllSubscriptionPlansAction(
  status?: string
): Promise<CustomResponse<ISubscriptionPlan[]>> {
  try {
    const url = status
      ? `${baseUrl}/subscription-plans?status=${encodeURIComponent(status)}`
      : `${baseUrl}/subscription-plans`;
    
    logger.info('[Subscription Plan Action] Fetching all plans', status ? `with status: ${status}` : '');
    const response = await serverGET(url);
    logger.info('[Subscription Plan Action] Plans fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Plan Action] Error fetching plans:', err);
    return {
      data: [] as ISubscriptionPlan[],
      message: err?.message || 'Failed to fetch subscription plans',
      error: true,
    };
  }
}

/**
 * Server action to update a subscription plan (admin only)
 */
export async function updateSubscriptionPlanAction(
  updateData: IUpdateSubscriptionPlan
): Promise<CustomResponse<ISubscriptionPlan>> {
  try {
    logger.info('[Subscription Plan Action] Updating plan:', {
      id: updateData.id,
      name: updateData.name,
    });

    const response = await serverPUT(`${SubscriptionPlanBaseURL}`, updateData);
    
    logger.info('[Subscription Plan Action] Plan updated successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[Subscription Plan Action] Error updating plan:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update subscription plan',
      error: true,
    };
  }
}

/**
 * Server action to delete a subscription plan (admin only)
 */
export async function deleteSubscriptionPlanAction(
  id: string
): Promise<CustomResponse<void>> {
  try {
    logger.info('[Subscription Plan Action] Deleting plan:', id);
    const response = await serverDELETE(`${SubscriptionPlanBaseURL}/${id}`);
    logger.info('[Subscription Plan Action] Plan deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Plan Action] Error deleting plan:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete subscription plan',
      error: true,
    };
  }
}

// ==================== SUBSCRIPTION FEATURE ACTIONS ====================

/**
 * Server action to create a subscription feature (admin only)
 */
export async function createSubscriptionFeatureAction(
  featureData: ICreateSubscriptionFeature
): Promise<CustomResponse<ISubscriptionFeature>> {
  try {
    logger.info('[Subscription Feature Action] Creating feature:', {
      subscriptionPlanId: featureData.subscriptionPlanId,
      featureId: featureData.featureId,
    });

    const response = await serverPOST(`${SubscriptionFeatureBaseURL}`, featureData);
    
    logger.info('[Subscription Feature Action] Feature created successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error creating feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create subscription feature',
      error: true,
    };
  }
}

/**
 * Server action to get features by subscription plan ID (public)
 */
export async function getFeaturesBySubscriptionPlanIdAction(
  planId: string
): Promise<CustomResponse<ISubscriptionFeature[]>> {
  try {
    logger.info('[Subscription Feature Action] Fetching features for plan:', planId);
    const response = await serverGET(`${SubscriptionFeatureBaseURL}/plan/${planId}`);
    logger.info('[Subscription Feature Action] Features fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error fetching features:', err);
    return {
      data: [] as ISubscriptionFeature[],
      message: err?.message || 'Failed to fetch subscription features',
      error: true,
    };
  }
}

/**
 * Server action to get subscription feature by ID (public)
 */
export async function getSubscriptionFeatureByIdAction(
  id: string
): Promise<CustomResponse<ISubscriptionFeature>> {
  try {
    logger.info('[Subscription Feature Action] Fetching feature by ID:', id);
    const response = await serverGET(`${SubscriptionFeatureBaseURL}/${id}`);
    logger.info('[Subscription Feature Action] Feature fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error fetching feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch subscription feature',
      error: true,
    };
  }
}

/**
 * Server action to get all subscription features (public)
 */
export async function getAllSubscriptionFeaturesAction(): Promise<CustomResponse<ISubscriptionFeature[]>> {
  try {
    logger.info('[Subscription Feature Action] Fetching all features');
    const response = await serverGET(`${baseUrl}/subscription-features`);
    logger.info('[Subscription Feature Action] Features fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error fetching features:', err);
    return {
      data: [] as ISubscriptionFeature[],
      message: err?.message || 'Failed to fetch subscription features',
      error: true,
    };
  }
}

/**
 * Server action to update a subscription feature (admin only)
 */
export async function updateSubscriptionFeatureAction(
  updateData: IUpdateSubscriptionFeature
): Promise<CustomResponse<ISubscriptionFeature>> {
  try {
    logger.info('[Subscription Feature Action] Updating feature:', {
      id: updateData.id,
    });

    const response = await serverPUT(`${SubscriptionFeatureBaseURL}`, updateData);
    
    logger.info('[Subscription Feature Action] Feature updated successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error updating feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update subscription feature',
      error: true,
    };
  }
}

/**
 * Server action to delete a subscription feature (admin only)
 */
export async function deleteSubscriptionFeatureAction(
  id: string
): Promise<CustomResponse<void>> {
  try {
    logger.info('[Subscription Feature Action] Deleting feature:', id);
    const response = await serverDELETE(`${SubscriptionFeatureBaseURL}/${id}`);
    logger.info('[Subscription Feature Action] Feature deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Feature Action] Error deleting feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete subscription feature',
      error: true,
    };
  }
}

// ==================== USER SUBSCRIPTION ACTIONS ====================

/**
 * Server action to create a user subscription (vendor/admin only)
 * Automatically adds userId from the authenticated user's token if not provided
 */
export async function createUserSubscriptionAction(
  subscriptionData: ICreateUserSubscription
): Promise<CustomResponse<IUserSubscription>> {
  try {
    // Get userId from token if not provided
    if (!subscriptionData.userId) {
      const decodedUser = await decodeServerAccessToken();
      if (!decodedUser?.id) {
        return {
          data: null as any,
          message: 'Authentication required. Please log in to create a subscription.',
          error: true,
        };
      }
      subscriptionData.userId = decodedUser.id;
    }

    logger.info('[User Subscription Action] Creating subscription:', {
      userId: subscriptionData.userId,
      subscriptionPlanId: subscriptionData.subscriptionPlanId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
    });

    const response = await serverPOST(`${UserSubscriptionBaseURL}`, subscriptionData);
    
    logger.info('[User Subscription Action] Subscription created successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error creating subscription:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create user subscription',
      error: true,
    };
  }
}

/**
 * Server action to get active subscription by user ID (authenticated)
 */
export async function getActiveSubscriptionByUserIdAction(
  userId: string
): Promise<CustomResponse<IUserSubscription | null>> {
  try {
    logger.info('[User Subscription Action] Fetching active subscription for user:', userId);
    const response = await serverGET(`${UserSubscriptionBaseURL}/active/user/${userId}`);
    logger.info('[User Subscription Action] Active subscription fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching active subscription:', err);
    return {
      data: null,
      message: err?.message || 'Failed to fetch active subscription',
      error: true,
    };
  }
}

/**
 * Server action to get current user's active subscription
 * Automatically uses the authenticated user's ID from token
 */
export async function getMyActiveSubscriptionAction(): Promise<CustomResponse<IUserSubscription | null>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null,
        message: 'Authentication required. Please log in to view your subscription.',
        error: true,
      };
    }

    return await getActiveSubscriptionByUserIdAction(decodedUser.id);
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching my active subscription:', err);
    return {
      data: null,
      message: err?.message || 'Failed to fetch active subscription',
      error: true,
    };
  }
}

/**
 * Server action to get subscriptions by user ID (authenticated)
 */
export async function getSubscriptionsByUserIdAction(
  userId: string,
  status?: string
): Promise<CustomResponse<IUserSubscription[]>> {
  try {
    const url = status
      ? `${UserSubscriptionBaseURL}/user/${userId}?status=${encodeURIComponent(status)}`
      : `${UserSubscriptionBaseURL}/user/${userId}`;
    
    logger.info('[User Subscription Action] Fetching subscriptions for user:', userId, status ? `with status: ${status}` : '');
    const response = await serverGET(url);
    logger.info('[User Subscription Action] Subscriptions fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching subscriptions:', err);
    return {
      data: [] as IUserSubscription[],
      message: err?.message || 'Failed to fetch user subscriptions',
      error: true,
    };
  }
}

/**
 * Server action to get current user's subscriptions
 * Automatically uses the authenticated user's ID from token
 */
export async function getMySubscriptionsAction(
  status?: string
): Promise<CustomResponse<IUserSubscription[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as IUserSubscription[],
        message: 'Authentication required. Please log in to view your subscriptions.',
        error: true,
      };
    }

    return await getSubscriptionsByUserIdAction(decodedUser.id, status);
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching my subscriptions:', err);
    return {
      data: [] as IUserSubscription[],
      message: err?.message || 'Failed to fetch subscriptions',
      error: true,
    };
  }
}

/**
 * Server action to get user subscription by ID (authenticated)
 */
export async function getUserSubscriptionByIdAction(
  id: string
): Promise<CustomResponse<IUserSubscription>> {
  try {
    logger.info('[User Subscription Action] Fetching subscription by ID:', id);
    const response = await serverGET(`${UserSubscriptionBaseURL}/${id}`);
    logger.info('[User Subscription Action] Subscription fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching subscription:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch user subscription',
      error: true,
    };
  }
}

/**
 * Server action to get all user subscriptions with optional status filter (admin only)
 */
export async function getAllUserSubscriptionsAction(
  status?: string
): Promise<CustomResponse<IUserSubscription[]>> {
  try {
    const url = status
      ? `${baseUrl}/user-subscriptions?status=${encodeURIComponent(status)}`
      : `${baseUrl}/user-subscriptions`;
    
    logger.info('[User Subscription Action] Fetching all subscriptions', status ? `with status: ${status}` : '');
    const response = await serverGET(url);
    logger.info('[User Subscription Action] Subscriptions fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error fetching subscriptions:', err);
    return {
      data: [] as IUserSubscription[],
      message: err?.message || 'Failed to fetch user subscriptions',
      error: true,
    };
  }
}

/**
 * Server action to update a user subscription (admin only)
 */
export async function updateUserSubscriptionAction(
  updateData: IUpdateUserSubscription
): Promise<CustomResponse<IUserSubscription>> {
  try {
    logger.info('[User Subscription Action] Updating subscription:', {
      id: updateData.id,
    });

    const response = await serverPUT(`${UserSubscriptionBaseURL}`, updateData);
    
    logger.info('[User Subscription Action] Subscription updated successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error updating subscription:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update user subscription',
      error: true,
    };
  }
}

/**
 * Server action to delete a user subscription (admin only)
 */
export async function deleteUserSubscriptionAction(
  id: string
): Promise<CustomResponse<void>> {
  try {
    logger.info('[User Subscription Action] Deleting subscription:', id);
    const response = await serverDELETE(`${UserSubscriptionBaseURL}/${id}`);
    logger.info('[User Subscription Action] Subscription deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[User Subscription Action] Error deleting subscription:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete user subscription',
      error: true,
    };
  }
}

// ==================== SUBSCRIPTION TRANSACTION ACTIONS ====================

/**
 * Server action to generate subscription payment URL (vendor/admin only)
 * Automatically adds userId from the authenticated user's token if not provided
 */
export async function generateSubscriptionPaymentAction(
  paymentRequest: ISubscriptionPaymentRequest
): Promise<CustomResponse<ISubscriptionPaymentResponse>> {
  try {
    // Get userId from token if not provided
    if (!paymentRequest.userId) {
      const decodedUser = await decodeServerAccessToken();
      if (!decodedUser?.id) {
        return {
          data: null as any,
          message: 'Authentication required. Please log in to generate payment.',
          error: true,
        };
      }
      paymentRequest.userId = decodedUser.id;
    }

    logger.info('[Subscription Transaction Action] Generating payment:', {
      userId: paymentRequest.userId,
      subscriptionPlanId: paymentRequest.subscriptionPlanId,
      transactionType: paymentRequest.transactionType,
    });

    const response = await serverPOST(`${SubscriptionTransactionBaseURL}/generate-payment`, paymentRequest);
    
    logger.info('[Subscription Transaction Action] Payment URL generated successfully:', {
      paymentReference: response?.data?.paymentReference,
      transactionId: response?.data?.transactionId,
    });

    return response;
  } catch (err: any) {
    logger.error('[Subscription Transaction Action] Error generating payment:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to generate subscription payment',
      error: true,
    };
  }
}

/**
 * Server action to get transaction by ID (authenticated)
 */
export async function getSubscriptionTransactionByIdAction(
  id: string
): Promise<CustomResponse<ISubscriptionTransaction>> {
  try {
    logger.info('[Subscription Transaction Action] Fetching transaction by ID:', id);
    const response = await serverGET(`${SubscriptionTransactionBaseURL}/${id}`);
    logger.info('[Subscription Transaction Action] Transaction fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Transaction Action] Error fetching transaction:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch subscription transaction',
      error: true,
    };
  }
}

/**
 * Server action to get transactions by user ID (authenticated)
 */
export async function getSubscriptionTransactionsByUserIdAction(
  userId: string
): Promise<CustomResponse<ISubscriptionTransaction[]>> {
  try {
    logger.info('[Subscription Transaction Action] Fetching transactions for user:', userId);
    const response = await serverGET(`${SubscriptionTransactionBaseURL}/user/${userId}`);
    logger.info('[Subscription Transaction Action] Transactions fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Transaction Action] Error fetching transactions:', err);
    return {
      data: [] as ISubscriptionTransaction[],
      message: err?.message || 'Failed to fetch subscription transactions',
      error: true,
    };
  }
}

/**
 * Server action to get current user's transactions
 * Automatically uses the authenticated user's ID from token
 */
export async function getMySubscriptionTransactionsAction(): Promise<CustomResponse<ISubscriptionTransaction[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as ISubscriptionTransaction[],
        message: 'Authentication required. Please log in to view your transactions.',
        error: true,
      };
    }

    return await getSubscriptionTransactionsByUserIdAction(decodedUser.id);
  } catch (err: any) {
    logger.error('[Subscription Transaction Action] Error fetching my transactions:', err);
    return {
      data: [] as ISubscriptionTransaction[],
      message: err?.message || 'Failed to fetch subscription transactions',
      error: true,
    };
  }
}

/**
 * Server action to get all transactions (admin only)
 */
export async function getAllSubscriptionTransactionsAction(): Promise<CustomResponse<ISubscriptionTransaction[]>> {
  try {
    logger.info('[Subscription Transaction Action] Fetching all transactions');
    const response = await serverGET(`${baseUrl}/subscription-transactions`);
    logger.info('[Subscription Transaction Action] All transactions fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Subscription Transaction Action] Error fetching all transactions:', err);
    return {
      data: [] as ISubscriptionTransaction[],
      message: err?.message || 'Failed to fetch all subscription transactions',
      error: true,
    };
  }
}
