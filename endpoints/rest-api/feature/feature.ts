import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IFeature, ICreateFeature, IUpdateFeature } from "@/interfaces/subscription/subscription";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const FeatureBaseURL = `${baseUrl}/feature`;

export const FEATURE_API = {
  /**
   * Create a new feature (admin only)
   */
  CREATE_FEATURE: async (featureData: ICreateFeature): Promise<CustomResponse<IFeature>> => {
    try {
      logger.info(`[FEATURE_API] Creating feature: ${featureData.name}`);
      const response = await POST(`${FeatureBaseURL}`, featureData);
      logger.info(`[FEATURE_API] Feature created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error creating feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create feature",
        error: true,
      };
    }
  },

  /**
   * Get feature by ID (public)
   */
  GET_FEATURE_BY_ID: async (id: string): Promise<CustomResponse<IFeature>> => {
    try {
      logger.info(`[FEATURE_API] Fetching feature by ID: ${id}`);
      const response = await GET(`${FeatureBaseURL}/${id}`);
      logger.info(`[FEATURE_API] Feature fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error fetching feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch feature",
        error: true,
      };
    }
  },

  /**
   * Get feature by slug (public)
   */
  GET_FEATURE_BY_SLUG: async (slug: string): Promise<CustomResponse<IFeature>> => {
    try {
      logger.info(`[FEATURE_API] Fetching feature by slug: ${slug}`);
      const response = await GET(`${FeatureBaseURL}/slug/${slug}`);
      logger.info(`[FEATURE_API] Feature fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error fetching feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch feature",
        error: true,
      };
    }
  },

  /**
   * Get all features (public)
   */
  GET_ALL_FEATURES: async (): Promise<CustomResponse<IFeature[]>> => {
    try {
      logger.info(`[FEATURE_API] Fetching all features`);
      const response = await GET(`${baseUrl}/features`);
      logger.info(`[FEATURE_API] Features fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error fetching features:", err);
      return {
        data: [] as IFeature[],
        message: err?.message || "Failed to fetch features",
        error: true,
      };
    }
  },

  /**
   * Update feature (admin only)
   */
  UPDATE_FEATURE: async (updateData: IUpdateFeature): Promise<CustomResponse<IFeature>> => {
    try {
      logger.info(`[FEATURE_API] Updating feature: ${updateData.id}`);
      const response = await PUT(`${FeatureBaseURL}`, updateData);
      logger.info(`[FEATURE_API] Feature updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error updating feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update feature",
        error: true,
      };
    }
  },

  /**
   * Delete feature (admin only)
   */
  DELETE_FEATURE: async (id: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[FEATURE_API] Deleting feature: ${id}`);
      const response = await DELETE(`${FeatureBaseURL}/${id}`);
      logger.info(`[FEATURE_API] Feature deleted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[FEATURE_API] Error deleting feature:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to delete feature",
        error: true,
      };
    }
  },
};
