import { baseUrl } from '@/endpoints/url';

export const campaignClaimEndpoints = {
  // Authenticated user routes
  claim: `${baseUrl}/campaign-claims`,
  getMyClaims: `${baseUrl}/campaign-claims/my`,
  cancelClaim: (id: string) => `${baseUrl}/campaign-claims/${id}/cancel`,

  // Admin / vendor routes
  getAllClaims: `${baseUrl}/campaign-claims`,
  getClaimById: (id: string) => `${baseUrl}/campaign-claims/${id}`,
  getClaimsByCampaignId: (campaignId: string) => `${baseUrl}/campaign-claims/campaign/${campaignId}`,
  fulfillClaim: (id: string) => `${baseUrl}/campaign-claims/${id}/fulfill`,
} as const;
