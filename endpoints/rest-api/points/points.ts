import { baseUrl } from '@/endpoints/url';

export const pointsEndpoints = {
  // Points Config
  getActivePointsConfig: `${baseUrl}/points/points-config/active`,
  getAllPointsConfigs: `${baseUrl}/points/points-config`,
  createPointsConfig: `${baseUrl}/points/points-config`,
  updatePointsConfig: (id: string) => `${baseUrl}/points/points-config/${id}`,
  activatePointsConfig: (id: string) => `${baseUrl}/points/points-config/${id}/activate`,
  deactivatePointsConfig: (id: string) => `${baseUrl}/points/points-config/${id}/deactivate`,
  
  // Tiers
  getAllTiers: `${baseUrl}/points/tier`,
  getTiersByConfigId: (configId: string) => `${baseUrl}/points/tier/config/${configId}`,
  getTierById: (id: string) => `${baseUrl}/points/tier/${id}`,
  createTier: `${baseUrl}/points/tier`,
  updateTier: (id: string) => `${baseUrl}/points/tier/${id}`,
  deleteTier: (id: string) => `${baseUrl}/points/tier/${id}`,
  activateTier: (id: string) => `${baseUrl}/points/tier/${id}/activate`,
  deactivateTier: (id: string) => `${baseUrl}/points/tier/${id}/deactivate`,
  
  // Tier Rules
  getTierRulesByTierId: (tierId: string) => `${baseUrl}/points/tier-rule/tier/${tierId}`,
  createTierRule: `${baseUrl}/points/tier-rule`,
  updateTierRule: `${baseUrl}/points/tier-rule`,
  
  // Tier Benefits
  getAllTierBenefits: `${baseUrl}/points/tier-benefit`,
  getTierBenefitById: (id: string) => `${baseUrl}/points/tier-benefit/${id}`,
  getTierBenefitsByTierId: (tierId: string) => `${baseUrl}/points/tier-benefit/tier/${tierId}`,
  getActiveTierBenefitsByTierId: (tierId: string) => `${baseUrl}/points/tier-benefit/tier/${tierId}/active`,
  getTierBenefitsByBenefitId: (benefitId: string) => `${baseUrl}/points/tier-benefit/benefit/${benefitId}`,
  createTierBenefit: `${baseUrl}/points/tier-benefit`,
  updateTierBenefit: (id: string) => `${baseUrl}/points/tier-benefit/${id}`,
  deleteTierBenefit: (id: string) => `${baseUrl}/points/tier-benefit/${id}`,
  activateTierBenefit: (id: string) => `${baseUrl}/points/tier-benefit/${id}/activate`,
  deactivateTierBenefit: (id: string) => `${baseUrl}/points/tier-benefit/${id}/deactivate`,
  
  // Benefits Catalog
  getAllBenefits: `${baseUrl}/points/benefit`,
  getActiveBenefits: `${baseUrl}/points/benefit/active`,
  getBenefitById: (id: string) => `${baseUrl}/points/benefit/${id}`,
  createBenefit: `${baseUrl}/points/benefit`,
  updateBenefit: (id: string) => `${baseUrl}/points/benefit/${id}`,
  deleteBenefit: (id: string) => `${baseUrl}/points/benefit/${id}`,
  activateBenefit: (id: string) => `${baseUrl}/points/benefit/${id}/activate`,
  deactivateBenefit: (id: string) => `${baseUrl}/points/benefit/${id}/deactivate`,
  
  // Referral Reward Config
  getAllReferralRewardConfigs: `${baseUrl}/points/referral-reward-configs`,
  getEnabledReferralRewardConfigs: `${baseUrl}/points/referral-reward-configs/enabled`,
  getReferralRewardConfigById: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}`,
  createReferralRewardConfig: `${baseUrl}/points/referral-reward-configs`,
  updateReferralRewardConfig: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}`,
  deleteReferralRewardConfig: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}`,
  enableReferralRewardConfig: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}/enable`,
  disableReferralRewardConfig: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}/disable`,
  validateReferralRewardAmounts: `${baseUrl}/points/referral-reward-configs/validate`,
  updateReferralMinPurchaseAmount: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}/min-purchase`,
  toggleReferralOneRewardPerUser: (id: string) => `${baseUrl}/points/referral-reward-configs/${id}/toggle-one-reward`,
  
  // Referral Slot Rewards
  getAllReferralSlotRewards: `${baseUrl}/points/referral-slot-rewards`,
  getActiveReferralSlotRewards: `${baseUrl}/points/referral-slot-rewards/active`,
  getReferralSlotRewardById: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}`,
  getReferralSlotRewardsByConfigId: (rewardConfigId: string) => `${baseUrl}/points/referral-slot-rewards/config/${rewardConfigId}`,
  getActiveReferralSlotRewardsByConfigId: (rewardConfigId: string) => `${baseUrl}/points/referral-slot-rewards/config/${rewardConfigId}/active`,
  getReferralSlotRewardBySlotNumber: (rewardConfigId: string, slotNumber: number) => `${baseUrl}/points/referral-slot-rewards/config/${rewardConfigId}/slot/${slotNumber}`,
  getNextAvailableSlotByConfigId: (rewardConfigId: string) => `${baseUrl}/points/referral-slot-rewards/config/${rewardConfigId}/next-slot`,
  createReferralSlotReward: `${baseUrl}/points/referral-slot-rewards`,
  updateReferralSlotReward: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}`,
  deleteReferralSlotReward: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}`,
  validateSlotNumber: (rewardConfigId: string, slotNumber: number) => `${baseUrl}/points/referral-slot-rewards/config/${rewardConfigId}/validate-slot/${slotNumber}`,
  activateReferralSlotReward: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}/activate`,
  deactivateReferralSlotReward: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}/deactivate`,
  updateReferralSlotRewardQuantity: (id: string) => `${baseUrl}/points/referral-slot-rewards/${id}/quantity`,
  
  // Earning Rules
  getAllEarningRules: `${baseUrl}/points/earning-rules`,
  getEnabledEarningRules: `${baseUrl}/points/earning-rules/enabled`,
  getEarningRulesBySourceType: (sourceType: string) => `${baseUrl}/points/earning-rules/source/${sourceType}`,
  getEarningRulesByExpiryRuleId: (expiryRuleId: string) => `${baseUrl}/points/earning-rules/expiry-rule/${expiryRuleId}`,
  getEarningRuleById: (id: string) => `${baseUrl}/points/earning-rules/${id}`,
  createEarningRule: `${baseUrl}/points/earning-rules`,
  updateEarningRule: (id: string) => `${baseUrl}/points/earning-rules/${id}`,
  deleteEarningRule: (id: string) => `${baseUrl}/points/earning-rules/${id}`,
  enableEarningRule: (id: string) => `${baseUrl}/points/earning-rules/${id}/enable`,
  disableEarningRule: (id: string) => `${baseUrl}/points/earning-rules/${id}/disable`,
  
  // Expiry Rules
  getAllExpiryRules: `${baseUrl}/points/expiry-rules`,
  getExpiryRuleById: (id: string) => `${baseUrl}/points/expiry-rules/${id}`,
  getExpiryRulesByType: (expiryType: string) => `${baseUrl}/points/expiry-rules/type/${expiryType}`,
  getExpiryRulesByMode: (expiryMode: string) => `${baseUrl}/points/expiry-rules/mode/${expiryMode}`,
  createExpiryRule: `${baseUrl}/points/expiry-rules`,
  updateExpiryRule: (id: string) => `${baseUrl}/points/expiry-rules/${id}`,
  deleteExpiryRule: (id: string) => `${baseUrl}/points/expiry-rules/${id}`,
  activateExpiryRule: (id: string) => `${baseUrl}/points/expiry-rules/${id}/activate`,
  deactivateExpiryRule: (id: string) => `${baseUrl}/points/expiry-rules/${id}/deactivate`,
  toggleExpiryRuleNotifications: (id: string) => `${baseUrl}/points/expiry-rules/${id}/toggle-notifications`,
  validateExpirySettings: `${baseUrl}/points/expiry-rules/validate`,
  calculateExpiryDate: (ruleId: string) => `${baseUrl}/points/expiry-rules/${ruleId}/calculate-expiry`,
  
  // Abuse Flags
  getAllAbuseFlags: `${baseUrl}/points/abuse-flag`,
  getAbuseFlagsByUserId: (userId: string) => `${baseUrl}/points/abuse-flag/user/${userId}`,
  createAbuseFlag: `${baseUrl}/points/abuse-flag`,
  updateAbuseFlag: `${baseUrl}/points/abuse-flag`,
  
  // Points History
  getMyPointsHistory: `${baseUrl}/points/history/my-history`,
  getPointsHistoryByUserId: (userId: string) => `${baseUrl}/points/history/user/${userId}`,
  
  // User Points Balance
  getMyPointsBalance: `${baseUrl}/points/balance/my-balance`,
  getUserPointsBalance: (userId: string) => `${baseUrl}/points/balance/user/${userId}`,
} as const;
