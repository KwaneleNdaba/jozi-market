'use server';

import { serverGET, serverPOST, serverPUT, serverPATCH } from '@/lib/server-client';
import { campaignClaimEndpoints } from '@/endpoints/rest-api/campaign-claim/campaign-claim';
import {
  ICampaignClaim,
  IClaimCampaignRequest,
} from '@/interfaces/campaign-claim/campaign-claim';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

// ============================================
// CAMPAIGN CLAIM ACTIONS - USER
// ============================================

/**
 * Claim a campaign
 * POST /campaign-claims
 */
export async function claimCampaignAction(
  campaignId: string
): Promise<CustomResponse<ICampaignClaim>> {
  try {
    logger.info('[Campaign Claim Action] Claiming campaign:', campaignId);
    const response = await serverPOST(
      campaignClaimEndpoints.claim,
      { campaignId }
    );
    logger.info('[Campaign Claim Action] Campaign claimed successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error claiming campaign:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to claim campaign',
      error: true,
    };
  }
}

/**
 * Get authenticated user's claims
 * GET /campaign-claims/my
 */
export async function getMyClaimsAction(): Promise<CustomResponse<ICampaignClaim[]>> {
  try {
    logger.info('[Campaign Claim Action] Fetching my claims');
    const response = await serverGET(campaignClaimEndpoints.getMyClaims);
    logger.info('[Campaign Claim Action] My claims fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error fetching my claims:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch claims',
      error: true,
    };
  }
}

/**
 * Cancel a pending claim
 * PATCH /campaign-claims/:id/cancel
 */
export async function cancelClaimAction(
  claimId: string
): Promise<CustomResponse<ICampaignClaim>> {
  try {
    logger.info('[Campaign Claim Action] Cancelling claim:', claimId);
    const response = await serverPATCH(
      campaignClaimEndpoints.cancelClaim(claimId),
      {}
    );
    logger.info('[Campaign Claim Action] Claim cancelled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error cancelling claim:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to cancel claim',
      error: true,
    };
  }
}

// ============================================
// CAMPAIGN CLAIM ACTIONS - ADMIN/VENDOR
// ============================================

/**
 * Get all claims (admin)
 * GET /campaign-claims
 */
export async function getAllClaimsAction(): Promise<CustomResponse<ICampaignClaim[]>> {
  try {
    logger.info('[Campaign Claim Action] Fetching all claims');
    const response = await serverGET(campaignClaimEndpoints.getAllClaims);
    logger.info('[Campaign Claim Action] All claims fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error fetching all claims:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch claims',
      error: true,
    };
  }
}

/**
 * Get claim by ID
 * GET /campaign-claims/:id
 */
export async function getClaimByIdAction(
  claimId: string
): Promise<CustomResponse<ICampaignClaim>> {
  try {
    logger.info('[Campaign Claim Action] Fetching claim:', claimId);
    const response = await serverGET(campaignClaimEndpoints.getClaimById(claimId));
    logger.info('[Campaign Claim Action] Claim fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error fetching claim:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch claim',
      error: true,
    };
  }
}

/**
 * Get all claims for a specific campaign
 * GET /campaign-claims/campaign/:campaignId
 */
export async function getClaimsByCampaignIdAction(
  campaignId: string
): Promise<CustomResponse<ICampaignClaim[]>> {
  try {
    logger.info('[Campaign Claim Action] Fetching claims for campaign:', campaignId);
    const response = await serverGET(
      campaignClaimEndpoints.getClaimsByCampaignId(campaignId)
    );
    logger.info('[Campaign Claim Action] Campaign claims fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error fetching campaign claims:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch campaign claims',
      error: true,
    };
  }
}

/**
 * Fulfill a claim (vendor/admin)
 * PATCH /campaign-claims/:id/fulfill
 */
export async function fulfillClaimAction(
  claimId: string
): Promise<CustomResponse<ICampaignClaim>> {
  try {
    logger.info('[Campaign Claim Action] Fulfilling claim:', claimId);
    const response = await serverPATCH(
      campaignClaimEndpoints.fulfillClaim(claimId),
      {}
    );
    logger.info('[Campaign Claim Action] Claim fulfilled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Campaign Claim Action] Error fulfilling claim:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fulfill claim',
      error: true,
    };
  }
}
