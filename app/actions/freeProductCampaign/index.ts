'use server';

import { serverGET, serverPOST, serverPUT, serverDELETE } from '@/lib/server-client';
import { freeProductCampaignEndpoints } from '@/endpoints/rest-api/freeProductCampaign/freeProductCampaign';
import type { CustomResponse } from '@/interfaces/response';
import type {
  IFreeProductCampaign,
  ICreateFreeProductCampaign,
  IUpdateFreeProductCampaign,
  ISetVisibilityPayload,
} from '@/interfaces/freeProductCampaign/freeProductCampaign';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

// ============================================
// GET ALL CAMPAIGNS
// ============================================

export async function getAllCampaignsAction(): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching all campaigns');
    const response = await serverGET(freeProductCampaignEndpoints.getAll);
    logger.info('[Free Product Campaign Action] Campaigns fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch campaigns',
      error: true,
    };
  }
}

// ============================================
// GET VISIBLE CAMPAIGNS
// ============================================

export async function getVisibleCampaignsAction(): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching visible campaigns');
    const response = await serverGET(freeProductCampaignEndpoints.getVisible);
    logger.info('[Free Product Campaign Action] Visible campaigns fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching visible campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch visible campaigns',
      error: true,
    };
  }
}

// ============================================
// GET PENDING CAMPAIGNS
// ============================================

export async function getPendingCampaignsAction(): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching pending campaigns');
    const response = await serverGET(freeProductCampaignEndpoints.getPending);
    logger.info('[Free Product Campaign Action] Pending campaigns fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching pending campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch pending campaigns',
      error: true,
    };
  }
}

// ============================================
// GET CAMPAIGNS BY VENDOR
// ============================================

export async function getCampaignsByVendorAction(vendorId: string): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching campaigns for vendor:', vendorId);
    const response = await serverGET(freeProductCampaignEndpoints.getByVendor(vendorId));
    logger.info('[Free Product Campaign Action] Vendor campaigns fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching vendor campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch vendor campaigns',
      error: true,
    };
  }
}

// ============================================
// GET MY CAMPAIGNS (Current Vendor)
// ============================================

export async function getMyCampaignsAction(): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as IFreeProductCampaign[],
        message: 'Authentication required. Please log in to view your campaigns.',
        error: true,
      };
    }

    return await getCampaignsByVendorAction(decodedUser.id);
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching my campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch campaigns',
      error: true,
    };
  }
}

// ============================================
// GET CAMPAIGNS BY PRODUCT
// ============================================

export async function getCampaignsByProductAction(productId: string): Promise<CustomResponse<IFreeProductCampaign[]>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching campaigns for product:', productId);
    const response = await serverGET(freeProductCampaignEndpoints.getByProduct(productId));
    logger.info('[Free Product Campaign Action] Product campaigns fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching product campaigns:', err);
    return {
      data: [] as IFreeProductCampaign[],
      message: err?.message || 'Failed to fetch product campaigns',
      error: true,
    };
  }
}

// ============================================
// GET CAMPAIGN BY ID
// ============================================

export async function getCampaignByIdAction(id: string): Promise<CustomResponse<IFreeProductCampaign | null>> {
  try {
    logger.info('[Free Product Campaign Action] Fetching campaign:', id);
    const response = await serverGET(freeProductCampaignEndpoints.getById(id));
    logger.info('[Free Product Campaign Action] Campaign fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error fetching campaign:', err);
    return {
      data: null,
      message: err?.message || 'Failed to fetch campaign',
      error: true,
    };
  }
}

// ============================================
// CREATE CAMPAIGN
// ============================================

export async function createCampaignAction(
  campaignData: Omit<ICreateFreeProductCampaign, 'vendorId'> & { vendorId?: string }
): Promise<CustomResponse<IFreeProductCampaign>> {
  try {
    // Get vendorId from token if not provided
    let vendorId = campaignData.vendorId;
    if (!vendorId) {
      const decodedUser = await decodeServerAccessToken();
      if (!decodedUser?.id) {
        return {
          data: null as any,
          message: 'Authentication required. Please log in to create a campaign.',
          error: true,
        };
      }
      vendorId = decodedUser.id;
    }

    logger.info('[Free Product Campaign Action] Creating campaign for vendor:', vendorId);
    
    const payload: ICreateFreeProductCampaign = {
      vendorId,
      productId: campaignData.productId,
      variantId: campaignData.variantId,
      quantity: campaignData.quantity,
      pointsRequired: campaignData.pointsRequired,
      expiryDate: campaignData.expiryDate,
    };
    
    const response = await serverPOST(
      freeProductCampaignEndpoints.create,
      payload
    );
    logger.info('[Free Product Campaign Action] Campaign created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error creating campaign:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create campaign',
      error: true,
    };
  }
}

// ============================================
// UPDATE CAMPAIGN
// ============================================

export async function updateCampaignAction(
  id: string,
  campaignData: IUpdateFreeProductCampaign
): Promise<CustomResponse<IFreeProductCampaign>> {
  try {
    logger.info('[Free Product Campaign Action] Updating campaign:', id);
    const response = await serverPUT(
      freeProductCampaignEndpoints.update(id),
      campaignData
    );
    logger.info('[Free Product Campaign Action] Campaign updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error updating campaign:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update campaign',
      error: true,
    };
  }
}

// ============================================
// DELETE CAMPAIGN
// ============================================

export async function deleteCampaignAction(id: string): Promise<CustomResponse<null>> {
  try {
    logger.info('[Free Product Campaign Action] Deleting campaign:', id);
    const response = await serverDELETE(freeProductCampaignEndpoints.delete(id));
    logger.info('[Free Product Campaign Action] Campaign deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error deleting campaign:', err);
    return {
      data: null,
      message: err?.message || 'Failed to delete campaign',
      error: true,
    };
  }
}

// ============================================
// APPROVE CAMPAIGN
// ============================================

export async function approveCampaignAction(id: string): Promise<CustomResponse<IFreeProductCampaign>> {
  try {
    logger.info('[Free Product Campaign Action] Approving campaign:', id);
    const response = await serverPUT(
      freeProductCampaignEndpoints.approve(id),
      {}
    );
    logger.info('[Free Product Campaign Action] Campaign approved successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error approving campaign:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to approve campaign',
      error: true,
    };
  }
}

// ============================================
// REJECT CAMPAIGN
// ============================================

export async function rejectCampaignAction(id: string): Promise<CustomResponse<IFreeProductCampaign>> {
  try {
    logger.info('[Free Product Campaign Action] Rejecting campaign:', id);
    const response = await serverPUT(
      freeProductCampaignEndpoints.reject(id),
      {}
    );
    logger.info('[Free Product Campaign Action] Campaign rejected successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error rejecting campaign:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to reject campaign',
      error: true,
    };
  }
}

// ============================================
// SET CAMPAIGN VISIBILITY
// ============================================

export async function setCampaignVisibilityAction(
  id: string,
  visible: boolean
): Promise<CustomResponse<IFreeProductCampaign>> {
  try {
    logger.info('[Free Product Campaign Action] Setting campaign visibility:', id, visible);
    const payload: ISetVisibilityPayload = { visible };
    const response = await serverPUT(
      freeProductCampaignEndpoints.setVisibility(id),
      payload
    );
    logger.info('[Free Product Campaign Action] Campaign visibility updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error setting campaign visibility:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to set campaign visibility',
      error: true,
    };
  }
}

// ============================================
// RECORD CAMPAIGN VIEW
// ============================================

export async function recordCampaignViewAction(id: string): Promise<CustomResponse<null>> {
  try {
    logger.info('[Free Product Campaign Action] Recording campaign view:', id);
    const response = await serverPOST(
      freeProductCampaignEndpoints.recordView(id),
      {}
    );
    logger.info('[Free Product Campaign Action] Campaign view recorded successfully');
    return response;
  } catch (err: any) {
    logger.error('[Free Product Campaign Action] Error recording campaign view:', err);
    return {
      data: null,
      message: err?.message || 'Failed to record campaign view',
      error: true,
    };
  }
}
