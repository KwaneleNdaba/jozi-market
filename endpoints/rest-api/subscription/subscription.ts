import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
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
} from "@/interfaces/subscription/subscription";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const SubscriptionPlanBaseURL = `${baseUrl}/subscription-plan`;
const SubscriptionFeatureBaseURL = `${baseUrl}/subscription-feature`;
const UserSubscriptionBaseURL = `${baseUrl}/user-subscription`;
const SubscriptionTransactionBaseURL = `${baseUrl}/subscription-transaction`;

// ==================== SUBSCRIPTION PLAN API ====================

export const SUBSCRIPTION_PLAN_API = {
  /**
   * Create a new subscription plan (admin only)
   */
  CREATE_PLAN: async (planData: ICreateSubscriptionPlan): Promise<CustomResponse<ISubscriptionPlan>> => {
    try {
      logger.info(`[SUBSCRIPTION_PLAN_API] Creating plan: ${planData.name}`);
      const response = await POST(`${SubscriptionPlanBaseURL}`, planData);
      logger.info(`[SUBSCRIPTION_PLAN_API] Plan created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_PLAN_API] Error creating plan:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create subscription plan",
        error: true,
      };
    }
  },

  /**
   * Get subscription plan by ID (public)
   */
  GET_PLAN_BY_ID: async (id: string): Promise<CustomResponse<ISubscriptionPlan>> => {
    try {
      logger.info(`[SUBSCRIPTION_PLAN_API] Fetching plan by ID: ${id}`);
      const response = await GET(`${SubscriptionPlanBaseURL}/${id}`);
      logger.info(`[SUBSCRIPTION_PLAN_API] Plan fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_PLAN_API] Error fetching plan:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch subscription plan",
        error: true,
      };
    }
  },

  /**
   * Get all subscription plans with optional status filter (public)
   */
  GET_ALL_PLANS: async (status?: string): Promise<CustomResponse<ISubscriptionPlan[]>> => {
    try {
      const url = status
        ? `${baseUrl}/subscription-plans?status=${encodeURIComponent(status)}`
        : `${baseUrl}/subscription-plans`;
      logger.info(`[SUBSCRIPTION_PLAN_API] Fetching all plans${status ? ` with status: ${status}` : ''}`);
      const response = await GET(url);
      logger.info(`[SUBSCRIPTION_PLAN_API] Plans fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_PLAN_API] Error fetching plans:", err);
      return {
        data: [] as ISubscriptionPlan[],
        message: err?.message || "Failed to fetch subscription plans",
        error: true,
      };
    }
  },

  /**
   * Update subscription plan (admin only)
   */
  UPDATE_PLAN: async (updateData: IUpdateSubscriptionPlan): Promise<CustomResponse<ISubscriptionPlan>> => {
    try {
      logger.info(`[SUBSCRIPTION_PLAN_API] Updating plan: ${updateData.id}`);
      const response = await PUT(`${SubscriptionPlanBaseURL}`, updateData);
      logger.info(`[SUBSCRIPTION_PLAN_API] Plan updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_PLAN_API] Error updating plan:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update subscription plan",
        error: true,
      };
    }
  },

  /**
   * Delete subscription plan (admin only)
   */
  DELETE_PLAN: async (id: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[SUBSCRIPTION_PLAN_API] Deleting plan: ${id}`);
      const response = await DELETE(`${SubscriptionPlanBaseURL}/${id}`);
      logger.info(`[SUBSCRIPTION_PLAN_API] Plan deleted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_PLAN_API] Error deleting plan:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to delete subscription plan",
        error: true,
      };
    }
  },
};

// ==================== SUBSCRIPTION FEATURE API ====================

export const SUBSCRIPTION_FEATURE_API = {
  /**
   * Create a new subscription feature (admin only)
   */
  CREATE_FEATURE: async (featureData: ICreateSubscriptionFeature): Promise<CustomResponse<ISubscriptionFeature>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Creating feature for plan: ${featureData.subscriptionPlanId}`);
      const response = await POST(`${SubscriptionFeatureBaseURL}`, featureData);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Feature created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error creating feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create subscription feature",
        error: true,
      };
    }
  },

  /**
   * Get features by subscription plan ID (public)
   */
  GET_FEATURES_BY_PLAN_ID: async (planId: string): Promise<CustomResponse<ISubscriptionFeature[]>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Fetching features for plan: ${planId}`);
      const response = await GET(`${SubscriptionFeatureBaseURL}/plan/${planId}`);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Features fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error fetching features:", err);
      return {
        data: [] as ISubscriptionFeature[],
        message: err?.message || "Failed to fetch subscription features",
        error: true,
      };
    }
  },

  /**
   * Get subscription feature by ID (public)
   */
  GET_FEATURE_BY_ID: async (id: string): Promise<CustomResponse<ISubscriptionFeature>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Fetching feature by ID: ${id}`);
      const response = await GET(`${SubscriptionFeatureBaseURL}/${id}`);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Feature fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error fetching feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch subscription feature",
        error: true,
      };
    }
  },

  /**
   * Get all subscription features (public)
   */
  GET_ALL_FEATURES: async (): Promise<CustomResponse<ISubscriptionFeature[]>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Fetching all features`);
      const response = await GET(`${baseUrl}/subscription-features`);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Features fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error fetching features:", err);
      return {
        data: [] as ISubscriptionFeature[],
        message: err?.message || "Failed to fetch subscription features",
        error: true,
      };
    }
  },

  /**
   * Update subscription feature (admin only)
   */
  UPDATE_FEATURE: async (updateData: IUpdateSubscriptionFeature): Promise<CustomResponse<ISubscriptionFeature>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Updating feature: ${updateData.id}`);
      const response = await PUT(`${SubscriptionFeatureBaseURL}`, updateData);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Feature updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error updating feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update subscription feature",
        error: true,
      };
    }
  },

  /**
   * Delete subscription feature (admin only)
   */
  DELETE_FEATURE: async (id: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[SUBSCRIPTION_FEATURE_API] Deleting feature: ${id}`);
      const response = await DELETE(`${SubscriptionFeatureBaseURL}/${id}`);
      logger.info(`[SUBSCRIPTION_FEATURE_API] Feature deleted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[SUBSCRIPTION_FEATURE_API] Error deleting feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to delete subscription feature",
        error: true,
      };
    }
  },
};

// ==================== USER SUBSCRIPTION API ====================

export const USER_SUBSCRIPTION_API = {
  /**
   * Create a new user subscription (vendor/admin only)
   */
  CREATE_SUBSCRIPTION: async (subscriptionData: ICreateUserSubscription): Promise<CustomResponse<IUserSubscription>> => {
    try {
      logger.info(`[USER_SUBSCRIPTION_API] Creating subscription for user: ${subscriptionData.userId}`);
      const response = await POST(`${UserSubscriptionBaseURL}`, subscriptionData);
      logger.info(`[USER_SUBSCRIPTION_API] Subscription created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error creating subscription:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create user subscription",
        error: true,
      };
    }
  },

  /**
   * Get active subscription by user ID (authenticated)
   */
  GET_ACTIVE_SUBSCRIPTION_BY_USER_ID: async (userId: string): Promise<CustomResponse<IUserSubscription | null>> => {
    try {
      logger.info(`[USER_SUBSCRIPTION_API] Fetching active subscription for user: ${userId}`);
      const response = await GET(`${UserSubscriptionBaseURL}/active/user/${userId}`);
      logger.info(`[USER_SUBSCRIPTION_API] Active subscription fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error fetching active subscription:", err);
      return {
        data: null,
        message: err?.message || "Failed to fetch active subscription",
        error: true,
      };
    }
  },

  /**
   * Get subscriptions by user ID (authenticated)
   */
  GET_SUBSCRIPTIONS_BY_USER_ID: async (userId: string, status?: string): Promise<CustomResponse<IUserSubscription[]>> => {
    try {
      const url = status
        ? `${UserSubscriptionBaseURL}/user/${userId}?status=${encodeURIComponent(status)}`
        : `${UserSubscriptionBaseURL}/user/${userId}`;
      logger.info(`[USER_SUBSCRIPTION_API] Fetching subscriptions for user: ${userId}${status ? ` with status: ${status}` : ''}`);
      const response = await GET(url);
      logger.info(`[USER_SUBSCRIPTION_API] Subscriptions fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error fetching subscriptions:", err);
      return {
        data: [] as IUserSubscription[],
        message: err?.message || "Failed to fetch user subscriptions",
        error: true,
      };
    }
  },

  /**
   * Get user subscription by ID (authenticated)
   */
  GET_SUBSCRIPTION_BY_ID: async (id: string): Promise<CustomResponse<IUserSubscription>> => {
    try {
      logger.info(`[USER_SUBSCRIPTION_API] Fetching subscription by ID: ${id}`);
      const response = await GET(`${UserSubscriptionBaseURL}/${id}`);
      logger.info(`[USER_SUBSCRIPTION_API] Subscription fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error fetching subscription:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch user subscription",
        error: true,
      };
    }
  },

  /**
   * Get all user subscriptions with optional status filter (admin only)
   */
  GET_ALL_SUBSCRIPTIONS: async (status?: string): Promise<CustomResponse<IUserSubscription[]>> => {
    try {
      const url = status
        ? `${baseUrl}/user-subscriptions?status=${encodeURIComponent(status)}`
        : `${baseUrl}/user-subscriptions`;
      logger.info(`[USER_SUBSCRIPTION_API] Fetching all subscriptions${status ? ` with status: ${status}` : ''}`);
      const response = await GET(url);
      logger.info(`[USER_SUBSCRIPTION_API] Subscriptions fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error fetching subscriptions:", err);
      return {
        data: [] as IUserSubscription[],
        message: err?.message || "Failed to fetch user subscriptions",
        error: true,
      };
    }
  },

  /**
   * Update user subscription (admin only)
   */
  UPDATE_SUBSCRIPTION: async (updateData: IUpdateUserSubscription): Promise<CustomResponse<IUserSubscription>> => {
    try {
      logger.info(`[USER_SUBSCRIPTION_API] Updating subscription: ${updateData.id}`);
      const response = await PUT(`${UserSubscriptionBaseURL}`, updateData);
      logger.info(`[USER_SUBSCRIPTION_API] Subscription updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error updating subscription:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update user subscription",
        error: true,
      };
    }
  },

  /**
   * Delete user subscription (admin only)
   */
  DELETE_SUBSCRIPTION: async (id: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[USER_SUBSCRIPTION_API] Deleting subscription: ${id}`);
      const response = await DELETE(`${UserSubscriptionBaseURL}/${id}`);
      logger.info(`[USER_SUBSCRIPTION_API] Subscription deleted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[USER_SUBSCRIPTION_API] Error deleting subscription:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to delete user subscription",
        error: true,
      };
    }
  },
};
