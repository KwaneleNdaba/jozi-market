import { baseUrl } from '../../url';
import { CustomResponse } from '@/interfaces/response';
import { IVendorApplication, ICreateVendorApplication, IUpdateVendorApplicationStatus } from '@/interfaces/vendor/vendor';
import { GET, POST, PUT, DELETE } from '@/lib/client';
import { logger } from '@/lib/log';

const VendorBaseURL = `${baseUrl}/vendor`;

export const VENDOR_API = {
  /**
   * Create a new vendor application
   * POST /api/vendor/application
   */
  CREATE_APPLICATION: async (applicationData: ICreateVendorApplication): Promise<CustomResponse<IVendorApplication>> => {
    try {
      logger.info(`[VENDOR_API] Creating vendor application for ${applicationData.shopName}`);
      const response = await POST(`${VendorBaseURL}/application`, applicationData);
      logger.info(`[VENDOR_API] Vendor application created successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error creating vendor application:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to create vendor application",
        error: true,
      };
    }
  },

  /**
   * Get vendor application by ID
   * GET /api/vendor/application/:id
   */
  GET_APPLICATION_BY_ID: async (id: string): Promise<CustomResponse<IVendorApplication>> => {
    try {
      logger.info(`[VENDOR_API] Getting vendor application ${id}`);
      const response = await GET(`${VendorBaseURL}/application/${id}`);
      logger.info(`[VENDOR_API] Vendor application retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error getting vendor application by ID:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to get vendor application",
        error: true,
      };
    }
  },

  /**
   * Get vendor application by user ID
   * GET /api/vendor/application/user/:userId
   * Requires authentication
   */
  GET_APPLICATION_BY_USER_ID: async (userId: string): Promise<CustomResponse<IVendorApplication | null>> => {
    try {
      logger.info(`[VENDOR_API] Getting vendor application for user ${userId}`);
      const response = await GET(`${VendorBaseURL}/application/user/${userId}`);
      logger.info(`[VENDOR_API] Vendor application retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error getting vendor application by user ID:", err);
      return {
        data: null,
        message: err instanceof Error ? err.message : "Failed to get vendor application",
        error: true,
      };
    }
  },

  /**
   * Get all vendor applications with optional status filter
   * GET /api/vendor/applications?status=pending
   * Requires authentication (admin only)
   */
  GET_ALL_APPLICATIONS: async (status?: string): Promise<CustomResponse<IVendorApplication[]>> => {
    try {
      logger.info(`[VENDOR_API] Getting all vendor applications${status ? ` with status ${status}` : ''}`);
      const params = status ? { status } : undefined;
      const response = await GET(`${VendorBaseURL}/applications`, { params });
      logger.info(`[VENDOR_API] Vendor applications retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error getting all vendor applications:", err);
      return {
        data: [] as IVendorApplication[],
        message: err instanceof Error ? err.message : "Failed to get vendor applications",
        error: true,
      };
    }
  },

  /**
   * Update vendor application status
   * PUT /api/vendor/application/status
   * Requires authentication (admin only)
   */
  UPDATE_APPLICATION_STATUS: async (updateData: IUpdateVendorApplicationStatus): Promise<CustomResponse<IVendorApplication>> => {
    try {
      logger.info(`[VENDOR_API] Updating vendor application status for ${updateData.id}`);
      const response = await PUT(`${VendorBaseURL}/application/status`, updateData);
      logger.info(`[VENDOR_API] Vendor application status updated successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error updating vendor application status:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update vendor application status",
        error: true,
      };
    }
  },

  /**
   * Delete vendor application
   * DELETE /api/vendor/application/:id
   * Requires authentication (admin only)
   */
  DELETE_APPLICATION: async (id: string): Promise<CustomResponse<null>> => {
    try {
      logger.info(`[VENDOR_API] Deleting vendor application ${id}`);
      const response = await DELETE(`${VendorBaseURL}/application/${id}`);
      logger.info(`[VENDOR_API] Vendor application deleted successfully`);
      return response;
    } catch (err) {
      logger.error("[VENDOR_API] Error deleting vendor application:", err);
      return {
        data: null,
        message: err instanceof Error ? err.message : "Failed to delete vendor application",
        error: true,
      };
    }
  },
};
