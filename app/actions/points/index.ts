'use server';

import { serverGET, serverPOST, serverPUT, serverDELETE } from '@/lib/server-client';
import { pointsEndpoints } from '@/endpoints/rest-api/points/points';
import {
  IPointsConfig,
  ICreatePointsConfig,
  ITier,
  ICreateTier,
  ITierRule,
  ICreateTierRule,
  ITierBenefit,
  ICreateTierBenefit,
  IBenefit,
  ICreateBenefit,
  IReferralRewardConfig,
  ICreateReferralRewardConfig,
  IReferralSlotReward,
  ICreateReferralSlotReward,
  IEarningRule,
  ICreateEarningRule,
  IExpiryRule,
  ICreateExpiryRule,
  IAbuseFlag,
  ICreateAbuseFlag,
  IPointsHistory,
  IUserPointsBalance,
} from '@/interfaces/points/points';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

// ============================================
// 1. POINTS CONFIG ACTIONS
// ============================================

export async function getActivePointsConfigAction(): Promise<CustomResponse<IPointsConfig>> {
  try {
    logger.info('[Points Action] Fetching active points config');
    const response = await serverGET(pointsEndpoints.getActivePointsConfig);
    logger.info('[Points Action] Active points config fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching active points config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch active points config',
      error: true,
    };
  }
}

export async function getAllPointsConfigsAction(): Promise<CustomResponse<IPointsConfig[]>> {
  try {
    logger.info('[Points Action] Fetching all points configs');
    const response = await serverGET(pointsEndpoints.getAllPointsConfigs);
    logger.info('[Points Action] All points configs fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching points configs:', err);
    return {
      data: [] as IPointsConfig[],
      message: err?.message || 'Failed to fetch points configs',
      error: true,
    };
  }
}

export async function createPointsConfigAction(
  configData: ICreatePointsConfig
): Promise<CustomResponse<IPointsConfig>> {
  try {
    logger.info('[Points Action] Creating points config');
    const response = await serverPOST(pointsEndpoints.createPointsConfig, configData);
    logger.info('[Points Action] Points config created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating points config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create points config',
      error: true,
    };
  }
}

export async function updatePointsConfigAction(
  id: string,
  configData: Partial<ICreatePointsConfig>
): Promise<CustomResponse<IPointsConfig>> {
  try {
    logger.info('[Points Action] Updating points config:', id);
    const response = await serverPUT(pointsEndpoints.updatePointsConfig(id), configData);
    logger.info('[Points Action] Points config updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating points config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update points config',
      error: true,
    };
  }
}

export async function activatePointsConfigAction(id: string): Promise<CustomResponse<IPointsConfig>> {
  try {
    logger.info('[Points Action] Activating points config:', id);
    const response = await serverPUT(pointsEndpoints.activatePointsConfig(id), {});
    logger.info('[Points Action] Points config activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating points config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate points config',
      error: true,
    };
  }
}

export async function deactivatePointsConfigAction(id: string): Promise<CustomResponse<IPointsConfig>> {
  try {
    logger.info('[Points Action] Deactivating points config:', id);
    const response = await serverPUT(pointsEndpoints.deactivatePointsConfig(id), {});
    logger.info('[Points Action] Points config deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating points config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate points config',
      error: true,
    };
  }
}

// ============================================
// 2. TIER ACTIONS
// ============================================

export async function getAllTiersAction(): Promise<CustomResponse<ITier[]>> {
  try {
    logger.info('[Points Action] Fetching all tiers');
    const response = await serverGET(pointsEndpoints.getAllTiers);
    logger.info('[Points Action] All tiers fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tiers:', err);
    return {
      data: [] as ITier[],
      message: err?.message || 'Failed to fetch tiers',
      error: true,
    };
  }
}

export async function getTiersByConfigIdAction(configId: string): Promise<CustomResponse<ITier[]>> {
  try {
    logger.info('[Points Action] Fetching tiers for config:', configId);
    const response = await serverGET(pointsEndpoints.getTiersByConfigId(configId));
    logger.info('[Points Action] Tiers for config fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tiers for config:', err);
    return {
      data: [] as ITier[],
      message: err?.message || 'Failed to fetch tiers for config',
      error: true,
    };
  }
}

export async function getTierByIdAction(id: string): Promise<CustomResponse<ITier>> {
  try {
    logger.info('[Points Action] Fetching tier by ID:', id);
    const response = await serverGET(pointsEndpoints.getTierById(id));
    logger.info('[Points Action] Tier fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch tier',
      error: true,
    };
  }
}

export async function createTierAction(tierData: ICreateTier): Promise<CustomResponse<ITier>> {
  try {
    logger.info('[Points Action] Creating tier');
    const response = await serverPOST(pointsEndpoints.createTier, tierData);
    logger.info('[Points Action] Tier created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create tier',
      error: true,
    };
  }
}

export async function updateTierAction(id: string, tierData: Partial<ITier>): Promise<CustomResponse<ITier>> {
  try {
    logger.info('[Points Action] Updating tier:', id);
    const response = await serverPUT(pointsEndpoints.updateTier(id), tierData);
    logger.info('[Points Action] Tier updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update tier',
      error: true,
    };
  }
}

export async function deleteTierAction(id: string): Promise<CustomResponse<void>> {
  try {
    logger.info('[Points Action] Deleting tier:', id);
    const response = await serverDELETE(pointsEndpoints.deleteTier(id));
    logger.info('[Points Action] Tier deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete tier',
      error: true,
    };
  }
}

export async function activateTierAction(id: string): Promise<CustomResponse<ITier>> {
  try {
    logger.info('[Points Action] Activating tier:', id);
    const response = await serverPUT(pointsEndpoints.activateTier(id), {});
    logger.info('[Points Action] Tier activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate tier',
      error: true,
    };
  }
}

export async function deactivateTierAction(id: string): Promise<CustomResponse<ITier>> {
  try {
    logger.info('[Points Action] Deactivating tier:', id);
    const response = await serverPUT(pointsEndpoints.deactivateTier(id), {});
    logger.info('[Points Action] Tier deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating tier:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate tier',
      error: true,
    };
  }
}

// ============================================
// 3. TIER RULE ACTIONS
// ============================================

export async function getTierRulesByTierIdAction(tierId: string): Promise<CustomResponse<ITierRule[]>> {
  try {
    logger.info('[Points Action] Fetching tier rules for tier:', tierId);
    const response = await serverGET(pointsEndpoints.getTierRulesByTierId(tierId));
    logger.info('[Points Action] Tier rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tier rules:', err);
    return {
      data: [] as ITierRule[],
      message: err?.message || 'Failed to fetch tier rules',
      error: true,
    };
  }
}

export async function createTierRuleAction(ruleData: ICreateTierRule): Promise<CustomResponse<ITierRule>> {
  try {
    logger.info('[Points Action] Creating tier rule');
    const response = await serverPOST(pointsEndpoints.createTierRule, ruleData);
    logger.info('[Points Action] Tier rule created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating tier rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create tier rule',
      error: true,
    };
  }
}

export async function updateTierRuleAction(ruleData: Partial<ITierRule> & { id: string }): Promise<CustomResponse<ITierRule>> {
  try {
    logger.info('[Points Action] Updating tier rule:', ruleData.id);
    const response = await serverPUT(pointsEndpoints.updateTierRule, ruleData);
    logger.info('[Points Action] Tier rule updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating tier rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update tier rule',
      error: true,
    };
  }
}

// ============================================
// 4. TIER BENEFIT ACTIONS
// ============================================

export async function getAllTierBenefitsAction(): Promise<CustomResponse<ITierBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching all tier benefits');
    const response = await serverGET(pointsEndpoints.getAllTierBenefits);
    logger.info('[Points Action] All tier benefits fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching all tier benefits:', err);
    return {
      data: [] as ITierBenefit[],
      message: err?.message || 'Failed to fetch all tier benefits',
      error: true,
    };
  }
}

export async function getTierBenefitByIdAction(id: string): Promise<CustomResponse<ITierBenefit>> {
  try {
    logger.info('[Points Action] Fetching tier benefit by ID:', id);
    const response = await serverGET(pointsEndpoints.getTierBenefitById(id));
    logger.info('[Points Action] Tier benefit fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tier benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch tier benefit',
      error: true,
    };
  }
}

export async function getTierBenefitsByTierIdAction(tierId: string): Promise<CustomResponse<ITierBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching tier benefits for tier:', tierId);
    const response = await serverGET(pointsEndpoints.getTierBenefitsByTierId(tierId));
    logger.info('[Points Action] Tier benefits fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tier benefits:', err);
    return {
      data: [] as ITierBenefit[],
      message: err?.message || 'Failed to fetch tier benefits',
      error: true,
    };
  }
}

export async function getActiveTierBenefitsByTierIdAction(tierId: string): Promise<CustomResponse<ITierBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching active tier benefits for tier:', tierId);
    const response = await serverGET(pointsEndpoints.getActiveTierBenefitsByTierId(tierId));
    logger.info('[Points Action] Active tier benefits fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching active tier benefits:', err);
    return {
      data: [] as ITierBenefit[],
      message: err?.message || 'Failed to fetch active tier benefits',
      error: true,
    };
  }
}

export async function getTierBenefitsByBenefitIdAction(benefitId: string): Promise<CustomResponse<ITierBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching tier benefits for benefit:', benefitId);
    const response = await serverGET(pointsEndpoints.getTierBenefitsByBenefitId(benefitId));
    logger.info('[Points Action] Tier benefits for benefit fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching tier benefits for benefit:', err);
    return {
      data: [] as ITierBenefit[],
      message: err?.message || 'Failed to fetch tier benefits for benefit',
      error: true,
    };
  }
}

export async function createTierBenefitAction(benefitData: ICreateTierBenefit): Promise<CustomResponse<ITierBenefit>> {
  try {
    logger.info('[Points Action] Creating tier benefit');
    const response = await serverPOST(pointsEndpoints.createTierBenefit, benefitData);
    logger.info('[Points Action] Tier benefit created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating tier benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create tier benefit',
      error: true,
    };
  }
}

export async function updateTierBenefitAction(id: string, benefitData: Partial<ICreateTierBenefit>): Promise<CustomResponse<ITierBenefit>> {
  try {
    logger.info('[Points Action] Updating tier benefit:', id);
    const response = await serverPUT(pointsEndpoints.updateTierBenefit(id), benefitData);
    logger.info('[Points Action] Tier benefit updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating tier benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update tier benefit',
      error: true,
    };
  }
}

export async function deleteTierBenefitAction(id: string): Promise<CustomResponse<void>> {
  try {
    logger.info('[Points Action] Deleting tier benefit:', id);
    const response = await serverDELETE(pointsEndpoints.deleteTierBenefit(id));
    logger.info('[Points Action] Tier benefit deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting tier benefit:', err);
    return {
      data: undefined,
      message: err?.message || 'Failed to delete tier benefit',
      error: true,
    };
  }
}

export async function activateTierBenefitAction(id: string): Promise<CustomResponse<ITierBenefit>> {
  try {
    logger.info('[Points Action] Activating tier benefit:', id);
    const response = await serverPUT(pointsEndpoints.activateTierBenefit(id), {});
    logger.info('[Points Action] Tier benefit activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating tier benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate tier benefit',
      error: true,
    };
  }
}

export async function deactivateTierBenefitAction(id: string): Promise<CustomResponse<ITierBenefit>> {
  try {
    logger.info('[Points Action] Deactivating tier benefit:', id);
    const response = await serverPUT(pointsEndpoints.deactivateTierBenefit(id), {});
    logger.info('[Points Action] Tier benefit deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating tier benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate tier benefit',
      error: true,
    };
  }
}

// ============================================
// 5. BENEFIT (CATALOG) ACTIONS
// ============================================

export async function getAllBenefitsAction(): Promise<CustomResponse<IBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching all benefits');
    const response = await serverGET(pointsEndpoints.getAllBenefits);
    logger.info('[Points Action] All benefits fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching benefits:', err);
    return {
      data: [] as IBenefit[],
      message: err?.message || 'Failed to fetch benefits',
      error: true,
    };
  }
}

export async function getActiveBenefitsAction(): Promise<CustomResponse<IBenefit[]>> {
  try {
    logger.info('[Points Action] Fetching active benefits');
    const response = await serverGET(pointsEndpoints.getActiveBenefits);
    logger.info('[Points Action] Active benefits fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching active benefits:', err);
    return {
      data: [] as IBenefit[],
      message: err?.message || 'Failed to fetch active benefits',
      error: true,
    };
  }
}

export async function getBenefitByIdAction(id: string): Promise<CustomResponse<IBenefit>> {
  try {
    logger.info('[Points Action] Fetching benefit by ID:', id);
    const response = await serverGET(pointsEndpoints.getBenefitById(id));
    logger.info('[Points Action] Benefit fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch benefit',
      error: true,
    };
  }
}

export async function createBenefitAction(benefitData: ICreateBenefit): Promise<CustomResponse<IBenefit>> {
  try {
    logger.info('[Points Action] Creating benefit');
    const response = await serverPOST(pointsEndpoints.createBenefit, benefitData);
    logger.info('[Points Action] Benefit created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create benefit',
      error: true,
    };
  }
}

export async function updateBenefitAction(id: string, benefitData: Partial<ICreateBenefit>): Promise<CustomResponse<IBenefit>> {
  try {
    logger.info('[Points Action] Updating benefit:', id);
    const response = await serverPUT(pointsEndpoints.updateBenefit(id), benefitData);
    logger.info('[Points Action] Benefit updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update benefit',
      error: true,
    };
  }
}

export async function deleteBenefitAction(id: string): Promise<CustomResponse<void>> {
  try {
    logger.info('[Points Action] Deleting benefit:', id);
    const response = await serverDELETE(pointsEndpoints.deleteBenefit(id));
    logger.info('[Points Action] Benefit deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting benefit:', err);
    return {
      data: undefined,
      message: err?.message || 'Failed to delete benefit',
      error: true,
    };
  }
}

export async function activateBenefitAction(id: string): Promise<CustomResponse<IBenefit>> {
  try {
    logger.info('[Points Action] Activating benefit:', id);
    const response = await serverPUT(pointsEndpoints.activateBenefit(id), {});
    logger.info('[Points Action] Benefit activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate benefit',
      error: true,
    };
  }
}

export async function deactivateBenefitAction(id: string): Promise<CustomResponse<IBenefit>> {
  try {
    logger.info('[Points Action] Deactivating benefit:', id);
    const response = await serverPUT(pointsEndpoints.deactivateBenefit(id), {});
    logger.info('[Points Action] Benefit deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating benefit:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate benefit',
      error: true,
    };
  }
}

// ============================================
// 6. REFERRAL REWARD CONFIG ACTIONS
// ============================================

export async function getAllReferralRewardConfigsAction(): Promise<CustomResponse<IReferralRewardConfig[]>> {
  try {
    logger.info('[Points Action] Fetching all referral reward configs');
    const response = await serverGET(pointsEndpoints.getAllReferralRewardConfigs);
    logger.info('[Points Action] Referral reward configs fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral reward configs:', err);
    return {
      data: [] as IReferralRewardConfig[],
      message: err?.message || 'Failed to fetch referral reward configs',
      error: true,
    };
  }
}

export async function getEnabledReferralRewardConfigsAction(): Promise<CustomResponse<IReferralRewardConfig[]>> {
  try {
    logger.info('[Points Action] Fetching enabled referral reward configs');
    const response = await serverGET(pointsEndpoints.getEnabledReferralRewardConfigs);
    logger.info('[Points Action] Enabled referral reward configs fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching enabled referral reward configs:', err);
    return {
      data: [] as IReferralRewardConfig[],
      message: err?.message || 'Failed to fetch enabled referral reward configs',
      error: true,
    };
  }
}

export async function getReferralRewardConfigByIdAction(id: string): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Fetching referral reward config:', id);
    const response = await serverGET(pointsEndpoints.getReferralRewardConfigById(id));
    logger.info('[Points Action] Referral reward config fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral reward config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch referral reward config',
      error: true,
    };
  }
}

export async function createReferralRewardConfigAction(
  configData: ICreateReferralRewardConfig
): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Creating referral reward config');
    const response = await serverPOST(pointsEndpoints.createReferralRewardConfig, configData);
    logger.info('[Points Action] Referral reward config created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating referral reward config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create referral reward config',
      error: true,
    };
  }
}

export async function updateReferralRewardConfigAction(
  id: string,
  configData: Partial<IReferralRewardConfig>
): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Updating referral reward config:', id);
    const response = await serverPUT(pointsEndpoints.updateReferralRewardConfig(id), configData);
    logger.info('[Points Action] Referral reward config updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating referral reward config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update referral reward config',
      error: true,
    };
  }
}

export async function deleteReferralRewardConfigAction(id: string): Promise<CustomResponse<null>> {
  try {
    logger.info('[Points Action] Deleting referral reward config:', id);
    const response = await serverDELETE(pointsEndpoints.deleteReferralRewardConfig(id));
    logger.info('[Points Action] Referral reward config deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting referral reward config:', err);
    return {
      data: null,
      message: err?.message || 'Failed to delete referral reward config',
      error: true,
    };
  }
}

export async function enableReferralRewardConfigAction(id: string): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Enabling referral reward config:', id);
    const response = await serverPUT(pointsEndpoints.enableReferralRewardConfig(id), {});
    logger.info('[Points Action] Referral reward config enabled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error enabling referral reward config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to enable referral reward config',
      error: true,
    };
  }
}

export async function disableReferralRewardConfigAction(id: string): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Disabling referral reward config:', id);
    const response = await serverPUT(pointsEndpoints.disableReferralRewardConfig(id), {});
    logger.info('[Points Action] Referral reward config disabled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error disabling referral reward config:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to disable referral reward config',
      error: true,
    };
  }
}

export async function validateReferralRewardAmountsAction(
  data: ICreateReferralRewardConfig | Partial<IReferralRewardConfig>
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Points Action] Validating referral reward amounts');
    const response = await serverPOST(pointsEndpoints.validateReferralRewardAmounts, data);
    logger.info('[Points Action] Referral reward amounts validated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error validating referral reward amounts:', err);
    return {
      data: null,
      message: err?.message || 'Failed to validate referral reward amounts',
      error: true,
    };
  }
}

export async function updateReferralMinPurchaseAmountAction(
  id: string,
  amount: number
): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Updating referral min purchase amount:', id);
    const response = await serverPUT(pointsEndpoints.updateReferralMinPurchaseAmount(id), { amount });
    logger.info('[Points Action] Referral min purchase amount updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating referral min purchase amount:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update referral min purchase amount',
      error: true,
    };
  }
}

export async function toggleReferralOneRewardPerUserAction(id: string): Promise<CustomResponse<IReferralRewardConfig>> {
  try {
    logger.info('[Points Action] Toggling referral one reward per user:', id);
    const response = await serverPUT(pointsEndpoints.toggleReferralOneRewardPerUser(id), {});
    logger.info('[Points Action] Referral one reward per user toggled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error toggling referral one reward per user:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to toggle referral one reward per user',
      error: true,
    };
  }
}

// ============================================
// 7. REFERRAL SLOT REWARD ACTIONS
// ============================================

export async function getAllReferralSlotRewardsAction(): Promise<CustomResponse<IReferralSlotReward[]>> {
  try {
    logger.info('[Points Action] Fetching all referral slot rewards');
    const response = await serverGET(pointsEndpoints.getAllReferralSlotRewards);
    logger.info('[Points Action] Referral slot rewards fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral slot rewards:', err);
    return {
      data: [] as IReferralSlotReward[],
      message: err?.message || 'Failed to fetch referral slot rewards',
      error: true,
    };
  }
}

export async function getActiveReferralSlotRewardsAction(): Promise<CustomResponse<IReferralSlotReward[]>> {
  try {
    logger.info('[Points Action] Fetching active referral slot rewards');
    const response = await serverGET(pointsEndpoints.getActiveReferralSlotRewards);
    logger.info('[Points Action] Active referral slot rewards fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching active referral slot rewards:', err);
    return {
      data: [] as IReferralSlotReward[],
      message: err?.message || 'Failed to fetch active referral slot rewards',
      error: true,
    };
  }
}

export async function getReferralSlotRewardByIdAction(id: string): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Fetching referral slot reward:', id);
    const response = await serverGET(pointsEndpoints.getReferralSlotRewardById(id));
    logger.info('[Points Action] Referral slot reward fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch referral slot reward',
      error: true,
    };
  }
}

export async function getReferralSlotRewardBySlotNumberAction(
  rewardConfigId: string,
  slotNumber: number
): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Fetching referral slot reward by slot number:', slotNumber);
    const response = await serverGET(pointsEndpoints.getReferralSlotRewardBySlotNumber(rewardConfigId, slotNumber));
    logger.info('[Points Action] Referral slot reward fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch referral slot reward',
      error: true,
    };
  }
}

export async function getReferralSlotRewardsByConfigIdAction(
  rewardConfigId: string
): Promise<CustomResponse<IReferralSlotReward[]>> {
  try {
    logger.info('[Points Action] Fetching referral slot rewards by config:', rewardConfigId);
    const response = await serverGET(pointsEndpoints.getReferralSlotRewardsByConfigId(rewardConfigId));
    logger.info('[Points Action] Referral slot rewards fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching referral slot rewards:', err);
    return {
      data: [] as IReferralSlotReward[],
      message: err?.message || 'Failed to fetch referral slot rewards',
      error: true,
    };
  }
}

export async function getActiveReferralSlotRewardsByConfigIdAction(
  rewardConfigId: string
): Promise<CustomResponse<IReferralSlotReward[]>> {
  try {
    logger.info('[Points Action] Fetching active referral slot rewards by config:', rewardConfigId);
    const response = await serverGET(pointsEndpoints.getActiveReferralSlotRewardsByConfigId(rewardConfigId));
    logger.info('[Points Action] Active referral slot rewards fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching active referral slot rewards:', err);
    return {
      data: [] as IReferralSlotReward[],
      message: err?.message || 'Failed to fetch active referral slot rewards',
      error: true,
    };
  }
}

export async function getNextAvailableSlotAction(rewardConfigId: string): Promise<CustomResponse<number>> {
  try {
    logger.info('[Points Action] Fetching next available slot for config:', rewardConfigId);
    const response = await serverGET(pointsEndpoints.getNextAvailableSlotByConfigId(rewardConfigId));
    logger.info('[Points Action] Next available slot fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching next available slot:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch next available slot',
      error: true,
    };
  }
}

export async function createReferralSlotRewardAction(
  rewardData: ICreateReferralSlotReward
): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Creating referral slot reward');
    const response = await serverPOST(pointsEndpoints.createReferralSlotReward, rewardData);
    logger.info('[Points Action] Referral slot reward created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create referral slot reward',
      error: true,
    };
  }
}

export async function updateReferralSlotRewardAction(
  id: string,
  rewardData: Partial<IReferralSlotReward>
): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Updating referral slot reward:', id);
    const response = await serverPUT(pointsEndpoints.updateReferralSlotReward(id), rewardData);
    logger.info('[Points Action] Referral slot reward updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update referral slot reward',
      error: true,
    };
  }
}

export async function deleteReferralSlotRewardAction(id: string): Promise<CustomResponse<null>> {
  try {
    logger.info('[Points Action] Deleting referral slot reward:', id);
    const response = await serverDELETE(pointsEndpoints.deleteReferralSlotReward(id));
    logger.info('[Points Action] Referral slot reward deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting referral slot reward:', err);
    return {
      data: null,
      message: err?.message || 'Failed to delete referral slot reward',
      error: true,
    };
  }
}

export async function validateSlotNumberAction(
  rewardConfigId: string,
  slotNumber: number,
  excludeId?: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Points Action] Validating slot number:', slotNumber);
    const url = excludeId 
      ? `${pointsEndpoints.validateSlotNumber(rewardConfigId, slotNumber)}?excludeId=${excludeId}`
      : pointsEndpoints.validateSlotNumber(rewardConfigId, slotNumber);
    const response = await serverPOST(url, {});
    logger.info('[Points Action] Slot number validated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error validating slot number:', err);
    return {
      data: null,
      message: err?.message || 'Failed to validate slot number',
      error: true,
    };
  }
}

export async function activateReferralSlotRewardAction(id: string): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Activating referral slot reward:', id);
    const response = await serverPUT(pointsEndpoints.activateReferralSlotReward(id), {});
    logger.info('[Points Action] Referral slot reward activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate referral slot reward',
      error: true,
    };
  }
}

export async function deactivateReferralSlotRewardAction(id: string): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Deactivating referral slot reward:', id);
    const response = await serverPUT(pointsEndpoints.deactivateReferralSlotReward(id), {});
    logger.info('[Points Action] Referral slot reward deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating referral slot reward:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate referral slot reward',
      error: true,
    };
  }
}

export async function updateReferralSlotRewardQuantityAction(
  id: string,
  quantity: number
): Promise<CustomResponse<IReferralSlotReward>> {
  try {
    logger.info('[Points Action] Updating referral slot reward quantity:', id);
    const response = await serverPUT(pointsEndpoints.updateReferralSlotRewardQuantity(id), { quantity });
    logger.info('[Points Action] Referral slot reward quantity updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating referral slot reward quantity:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update referral slot reward quantity',
      error: true,
    };
  }
}

// ============================================
// 8. EARNING RULE ACTIONS
// ============================================

export async function getAllEarningRulesAction(): Promise<CustomResponse<IEarningRule[]>> {
  try {
    logger.info('[Points Action] Fetching all earning rules');
    const response = await serverGET(pointsEndpoints.getAllEarningRules);
    logger.info('[Points Action] All earning rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching earning rules:', err);
    return {
      data: [] as IEarningRule[],
      message: err?.message || 'Failed to fetch earning rules',
      error: true,
    };
  }
}

export async function getEnabledEarningRulesAction(): Promise<CustomResponse<IEarningRule[]>> {
  try {
    logger.info('[Points Action] Fetching enabled earning rules');
    const response = await serverGET(pointsEndpoints.getEnabledEarningRules);
    logger.info('[Points Action] Enabled earning rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching enabled earning rules:', err);
    return {
      data: [] as IEarningRule[],
      message: err?.message || 'Failed to fetch enabled earning rules',
      error: true,
    };
  }
}

export async function getEarningRulesBySourceTypeAction(
  sourceType: string
): Promise<CustomResponse<IEarningRule[]>> {
  try {
    logger.info('[Points Action] Fetching earning rules for source type:', sourceType);
    const response = await serverGET(pointsEndpoints.getEarningRulesBySourceType(sourceType));
    logger.info('[Points Action] Earning rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching earning rules by source type:', err);
    return {
      data: [] as IEarningRule[],
      message: err?.message || 'Failed to fetch earning rules by source type',
      error: true,
    };
  }
}

export async function getEarningRulesByExpiryRuleIdAction(
  expiryRuleId: string
): Promise<CustomResponse<IEarningRule[]>> {
  try {
    logger.info('[Points Action] Fetching earning rules by expiry rule:', expiryRuleId);
    const response = await serverGET(pointsEndpoints.getEarningRulesByExpiryRuleId(expiryRuleId));
    logger.info('[Points Action] Earning rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching earning rules by expiry rule:', err);
    return {
      data: [] as IEarningRule[],
      message: err?.message || 'Failed to fetch earning rules by expiry rule',
      error: true,
    };
  }
}

export async function getEarningRuleByIdAction(
  id: string
): Promise<CustomResponse<IEarningRule>> {
  try {
    logger.info('[Points Action] Fetching earning rule by id:', id);
    const response = await serverGET(pointsEndpoints.getEarningRuleById(id));
    logger.info('[Points Action] Earning rule fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch earning rule',
      error: true,
    };
  }
}

export async function createEarningRuleAction(
  ruleData: ICreateEarningRule
): Promise<CustomResponse<IEarningRule>> {
  try {
    logger.info('[Points Action] Creating earning rule');
    const response = await serverPOST(pointsEndpoints.createEarningRule, ruleData);
    logger.info('[Points Action] Earning rule created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create earning rule',
      error: true,
    };
  }
}

export async function updateEarningRuleAction(
  id: string,
  ruleData: Partial<IEarningRule>
): Promise<CustomResponse<IEarningRule>> {
  try {
    logger.info('[Points Action] Updating earning rule:', id);
    const response = await serverPUT(pointsEndpoints.updateEarningRule(id), ruleData);
    logger.info('[Points Action] Earning rule updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update earning rule',
      error: true,
    };
  }
}

export async function deleteEarningRuleAction(id: string): Promise<CustomResponse<void>> {
  try {
    logger.info('[Points Action] Deleting earning rule:', id);
    const response = await serverDELETE(pointsEndpoints.deleteEarningRule(id));
    logger.info('[Points Action] Earning rule deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete earning rule',
      error: true,
    };
  }
}

export async function enableEarningRuleAction(id: string): Promise<CustomResponse<IEarningRule>> {
  try {
    logger.info('[Points Action] Enabling earning rule:', id);
    const response = await serverPUT(pointsEndpoints.enableEarningRule(id), {});
    logger.info('[Points Action] Earning rule enabled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error enabling earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to enable earning rule',
      error: true,
    };
  }
}

export async function disableEarningRuleAction(id: string): Promise<CustomResponse<IEarningRule>> {
  try {
    logger.info('[Points Action] Disabling earning rule:', id);
    const response = await serverPUT(pointsEndpoints.disableEarningRule(id), {});
    logger.info('[Points Action] Earning rule disabled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error disabling earning rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to disable earning rule',
      error: true,
    };
  }
}

// ============================================
// 9. EXPIRY RULE ACTIONS
// ============================================

export async function getAllExpiryRulesAction(): Promise<CustomResponse<IExpiryRule[]>> {
  try {
    logger.info('[Points Action] Fetching all expiry rules');
    const response = await serverGET(pointsEndpoints.getAllExpiryRules);
    logger.info('[Points Action] All expiry rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching expiry rules:', err);
    return {
      data: [] as IExpiryRule[],
      message: err?.message || 'Failed to fetch expiry rules',
      error: true,
    };
  }
}

export async function getExpiryRuleByIdAction(id: string): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Fetching expiry rule by ID:', id);
    const response = await serverGET(pointsEndpoints.getExpiryRuleById(id));
    logger.info('[Points Action] Expiry rule fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch expiry rule',
      error: true,
    };
  }
}

export async function getExpiryRulesByTypeAction(
  expiryType: string
): Promise<CustomResponse<IExpiryRule[]>> {
  try {
    logger.info('[Points Action] Fetching expiry rules for type:', expiryType);
    const response = await serverGET(pointsEndpoints.getExpiryRulesByType(expiryType));
    logger.info('[Points Action] Expiry rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching expiry rules:', err);
    return {
      data: [] as IExpiryRule[],
      message: err?.message || 'Failed to fetch expiry rules',
      error: true,
    };
  }
}

export async function getExpiryRulesByModeAction(
  expiryMode: string
): Promise<CustomResponse<IExpiryRule[]>> {
  try {
    logger.info('[Points Action] Fetching expiry rules for mode:', expiryMode);
    const response = await serverGET(pointsEndpoints.getExpiryRulesByMode(expiryMode));
    logger.info('[Points Action] Expiry rules fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching expiry rules:', err);
    return {
      data: [] as IExpiryRule[],
      message: err?.message || 'Failed to fetch expiry rules',
      error: true,
    };
  }
}

export async function createExpiryRuleAction(
  ruleData: ICreateExpiryRule
): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Creating expiry rule');
    const response = await serverPOST(pointsEndpoints.createExpiryRule, ruleData);
    logger.info('[Points Action] Expiry rule created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create expiry rule',
      error: true,
    };
  }
}

export async function updateExpiryRuleAction(
  id: string,
  ruleData: Partial<IExpiryRule>
): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Updating expiry rule:', id);
    const response = await serverPUT(pointsEndpoints.updateExpiryRule(id), ruleData);
    logger.info('[Points Action] Expiry rule updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update expiry rule',
      error: true,
    };
  }
}

export async function deleteExpiryRuleAction(id: string): Promise<CustomResponse<void>> {
  try {
    logger.info('[Points Action] Deleting expiry rule:', id);
    const response = await serverDELETE(pointsEndpoints.deleteExpiryRule(id));
    logger.info('[Points Action] Expiry rule deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deleting expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete expiry rule',
      error: true,
    };
  }
}

export async function activateExpiryRuleAction(id: string): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Activating expiry rule:', id);
    const response = await serverPUT(pointsEndpoints.activateExpiryRule(id), {});
    logger.info('[Points Action] Expiry rule activated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error activating expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to activate expiry rule',
      error: true,
    };
  }
}

export async function deactivateExpiryRuleAction(id: string): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Deactivating expiry rule:', id);
    const response = await serverPUT(pointsEndpoints.deactivateExpiryRule(id), {});
    logger.info('[Points Action] Expiry rule deactivated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error deactivating expiry rule:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to deactivate expiry rule',
      error: true,
    };
  }
}

export async function toggleExpiryRuleNotificationsAction(id: string): Promise<CustomResponse<IExpiryRule>> {
  try {
    logger.info('[Points Action] Toggling expiry rule notifications:', id);
    const response = await serverPUT(pointsEndpoints.toggleExpiryRuleNotifications(id), {});
    logger.info('[Points Action] Expiry rule notifications toggled successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error toggling expiry rule notifications:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to toggle expiry rule notifications',
      error: true,
    };
  }
}

export async function validateExpirySettingsAction(
  data: ICreateExpiryRule | Partial<IExpiryRule>
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Points Action] Validating expiry settings');
    const response = await serverPOST(pointsEndpoints.validateExpirySettings, data);
    logger.info('[Points Action] Expiry settings validated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error validating expiry settings:', err);
    return {
      data: null,
      message: err?.message || 'Failed to validate expiry settings',
      error: true,
    };
  }
}

export async function calculateExpiryDateAction(
  ruleId: string,
  earnedDate: Date
): Promise<CustomResponse<Date>> {
  try {
    logger.info('[Points Action] Calculating expiry date for rule:', ruleId);
    const response = await serverPOST(pointsEndpoints.calculateExpiryDate(ruleId), { earnedDate });
    logger.info('[Points Action] Expiry date calculated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error calculating expiry date:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to calculate expiry date',
      error: true,
    };
  }
}

// ============================================
// 12. ABUSE FLAG ACTIONS
// ============================================

export async function getAllAbuseFlagsAction(): Promise<CustomResponse<IAbuseFlag[]>> {
  try {
    logger.info('[Points Action] Fetching all abuse flags');
    const response = await serverGET(pointsEndpoints.getAllAbuseFlags);
    logger.info('[Points Action] All abuse flags fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching abuse flags:', err);
    return {
      data: [] as IAbuseFlag[],
      message: err?.message || 'Failed to fetch abuse flags',
      error: true,
    };
  }
}

export async function getAbuseFlagsByUserIdAction(
  userId: string
): Promise<CustomResponse<IAbuseFlag[]>> {
  try {
    logger.info('[Points Action] Fetching abuse flags for user:', userId);
    const response = await serverGET(pointsEndpoints.getAbuseFlagsByUserId(userId));
    logger.info('[Points Action] Abuse flags fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching abuse flags:', err);
    return {
      data: [] as IAbuseFlag[],
      message: err?.message || 'Failed to fetch abuse flags',
      error: true,
    };
  }
}

export async function createAbuseFlagAction(
  flagData: ICreateAbuseFlag
): Promise<CustomResponse<IAbuseFlag>> {
  try {
    logger.info('[Points Action] Creating abuse flag');
    const response = await serverPOST(pointsEndpoints.createAbuseFlag, flagData);
    logger.info('[Points Action] Abuse flag created successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error creating abuse flag:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create abuse flag',
      error: true,
    };
  }
}

export async function updateAbuseFlagAction(
  flagData: Partial<IAbuseFlag> & { id: string }
): Promise<CustomResponse<IAbuseFlag>> {
  try {
    logger.info('[Points Action] Updating abuse flag:', flagData.id);
    const response = await serverPUT(pointsEndpoints.updateAbuseFlag, flagData);
    logger.info('[Points Action] Abuse flag updated successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error updating abuse flag:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update abuse flag',
      error: true,
    };
  }
}

// ============================================
// 13. POINTS HISTORY ACTIONS
// ============================================

export async function getMyPointsHistoryAction(): Promise<CustomResponse<IPointsHistory[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as IPointsHistory[],
        message: 'Authentication required. Please log in to view your points history.',
        error: true,
      };
    }

    logger.info('[Points Action] Fetching my points history');
    const response = await serverGET(pointsEndpoints.getMyPointsHistory);
    logger.info('[Points Action] Points history fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching points history:', err);
    return {
      data: [] as IPointsHistory[],
      message: err?.message || 'Failed to fetch points history',
      error: true,
    };
  }
}

export async function getPointsHistoryByUserIdAction(
  userId: string
): Promise<CustomResponse<IPointsHistory[]>> {
  try {
    logger.info('[Points Action] Fetching points history for user:', userId);
    const response = await serverGET(pointsEndpoints.getPointsHistoryByUserId(userId));
    logger.info('[Points Action] Points history fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching points history:', err);
    return {
      data: [] as IPointsHistory[],
      message: err?.message || 'Failed to fetch points history',
      error: true,
    };
  }
}

// ============================================
// 14. USER POINTS BALANCE ACTIONS
// ============================================

export async function getMyPointsBalanceAction(): Promise<CustomResponse<IUserPointsBalance>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: null as any,
        message: 'Authentication required. Please log in to view your points balance.',
        error: true,
      };
    }

    logger.info('[Points Action] Fetching my points balance');
    const response = await serverGET(pointsEndpoints.getMyPointsBalance);
    logger.info('[Points Action] Points balance fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching points balance:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch points balance',
      error: true,
    };
  }
}

export async function getUserPointsBalanceAction(
  userId: string
): Promise<CustomResponse<IUserPointsBalance>> {
  try {
    logger.info('[Points Action] Fetching points balance for user:', userId);
    const response = await serverGET(pointsEndpoints.getUserPointsBalance(userId));
    logger.info('[Points Action] Points balance fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Points Action] Error fetching points balance:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch points balance',
      error: true,
    };
  }
}
