import { IFreeProductCampaign } from "../freeProductCampaign/freeProductCampaign";

export type ClaimStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface ICampaignClaim {
  id: string;
  campaignId: string;
  userId: string;
  status: ClaimStatus;
  claimedAt: Date;
  fulfilledAt?: Date | null;
  campaign?: IFreeProductCampaign;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCampaignClaim {
  campaignId: string;
}

export interface IClaimCampaignRequest {
  campaignId: string;
}

export interface ICancelClaimRequest {
  id: string;
}

export interface IFulfillClaimRequest {
  id: string;
}
