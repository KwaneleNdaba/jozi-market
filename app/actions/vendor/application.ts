'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IVendorApplication, ICreateVendorApplication, IUpdateVendorApplicationStatus, mapVendorTypeToBackend } from '@/interfaces/vendor/vendor';
import { CustomResponse } from '@/interfaces/response';
import { getServerAccessToken, decodeServerAccessToken } from '@/lib/server-auth';
import { logger } from '@/lib/log';

/**
 * Server action to create a vendor application
 */
export async function createVendorApplicationAction(
  applicationData: ICreateVendorApplication
): Promise<CustomResponse<IVendorApplication>> {
  try {
    // Get user ID from token if available
    const decodedUser = await decodeServerAccessToken();
    if (decodedUser?.id) {
      applicationData.userId = decodedUser.id;
    }

    // Map vendorType to backend format
    const mappedData: ICreateVendorApplication = {
      ...applicationData,
      vendorType: mapVendorTypeToBackend(applicationData.vendorType),
    };

    logger.info('[Vendor Application] Submitting application:', {
      userId: mappedData.userId,
      vendorType: mappedData.vendorType,
      shopName: mappedData.shopName,
      email: mappedData.email,
      hasFiles: !!mappedData.files,
      fileKeys: Object.keys(mappedData.files || {}),
    });

    logger.info('[Vendor Application] Full payload being sent:', JSON.stringify(mappedData, null, 2));
    logger.info(`[Vendor Application] API Endpoint: ${baseUrl}/vendor/application`);

    const response = await serverPOST(`${baseUrl}/vendor/application`, mappedData);
    
    logger.info('[Vendor Application] Raw response received:', JSON.stringify(response, null, 2));
    logger.info('[Vendor Application] Response parsed:', {
      error: response?.error,
      message: response?.message,
      hasData: !!response?.data,
      dataId: response?.data?.id,
      dataType: typeof response?.data,
    });

    // Ensure response has the correct structure
    if (!response || typeof response !== 'object') {
      logger.error('[Vendor Application] Invalid response structure:', response);
      return {
        data: null as any,
        message: 'Invalid response from server',
        error: true,
      };
    }

    return response;
  } catch (err) {
    logger.error('[Vendor Application] Error creating application:', err);
    
    // Return error response instead of throwing
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to create vendor application',
      error: true,
    };
  }
}

/**
 * Server action to get vendor application by ID
 */
export async function getVendorApplicationByIdAction(
  id: string
): Promise<CustomResponse<IVendorApplication>> {
  try {
    const response = await serverGET(`${baseUrl}/vendor/application/${id}`);
    return response;
  } catch (err) {
    logger.error('Get vendor application by ID error:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to get vendor application',
      error: true,
    };
  }
}

/**
 * Server action to get vendor application by user ID
 * Requires authentication
 */
export async function getVendorApplicationByUserIdAction(
  userId: string
): Promise<CustomResponse<IVendorApplication | null>> {
  try {
    const token = await getServerAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await serverGET(`${baseUrl}/vendor/application/user/${userId}`);
    return response;
  } catch (err) {
    logger.error('Get vendor application by user ID error:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to get vendor application',
      error: true,
    };
  }
}

/**
 * Server action to get current user's vendor application
 * Uses the authenticated user's ID from the token
 */
export async function getMyVendorApplicationAction(): Promise<CustomResponse<IVendorApplication | null>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    
    logger.info('[Vendor Application] Decoded user from token:', {
      hasDecodedUser: !!decodedUser,
      userId: decodedUser?.id,
      userIdType: typeof decodedUser?.id,
      email: decodedUser?.email,
    });

    if (!decodedUser) {
      logger.error('[Vendor Application] No decoded user found');
      throw new Error('Authentication required - token not found or invalid');
    }

    if (!decodedUser.id) {
      logger.error('[Vendor Application] No user ID in decoded token:', decodedUser);
      throw new Error('Authentication required - user ID not found in token');
    }

    // Ensure ID is a string
    const userId = String(decodedUser.id);
    if (!userId || userId === 'undefined' || userId === 'null' || userId === 'NaN') {
      logger.error('[Vendor Application] Invalid user ID:', { userId, decodedUser });
      throw new Error('Invalid user ID in token');
    }

    logger.info('[Vendor Application] Fetching application for user:', userId);
    const response = await serverGET(`${baseUrl}/vendor/application/user/${userId}`);
    
    logger.info('[Vendor Application] Response received:', {
      error: response?.error,
      message: response?.message,
      hasData: !!response?.data,
    });

    return response;
  } catch (err) {
    logger.error('[Vendor Application] Get my vendor application error:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to get vendor application',
      error: true,
    };
  }
}

/**
 * Server action to get all vendor applications (admin only)
 * @param status Optional status filter: 'pending' | 'approved' | 'rejected'
 */
export async function getAllVendorApplicationsAction(
  status?: string
): Promise<CustomResponse<IVendorApplication[]>> {
  try {
    const token = await getServerAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = status
      ? `${baseUrl}/vendor/applications?status=${encodeURIComponent(status)}`
      : `${baseUrl}/vendor/applications`;

    const response = await serverGET(url);
    return response;
  } catch (err) {
    logger.error('Get all vendor applications error:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to get vendor applications',
      error: true,
    };
  }
}

/**
 * Server action to update vendor application status (admin only)
 */
export async function updateVendorApplicationStatusAction(
  updateData: IUpdateVendorApplicationStatus
): Promise<CustomResponse<IVendorApplication>> {
  try {
    const token = await getServerAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get current user ID for reviewedBy
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      throw new Error('Authentication required');
    }

    // Ensure reviewedBy is set
    const updatePayload: IUpdateVendorApplicationStatus = {
      ...updateData,
      reviewedBy: updateData.reviewedBy || decodedUser.id,
    };

    const response = await serverPUT(`${baseUrl}/vendor/application/status`, updatePayload);
    return response;
  } catch (err) {
    logger.error('Update vendor application status error:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update vendor application status',
      error: true,
    };
  }
}

/**
 * Server action to delete vendor application (admin only)
 */
export async function deleteVendorApplicationAction(
  id: string
): Promise<CustomResponse<null>> {
  try {
    const token = await getServerAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await serverDELETE(`${baseUrl}/vendor/application/${id}`);
    return response;
  } catch (err) {
    logger.error('Delete vendor application error:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete vendor application',
      error: true,
    };
  }
}
