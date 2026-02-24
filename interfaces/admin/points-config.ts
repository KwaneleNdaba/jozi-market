// Points Configuration Interfaces

export interface IPointsConfig {
  id: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  pointsEnabled: boolean;
  redemptionEnabled: boolean;
  allowStackWithDiscounts: boolean;
  baseEarn: IBaseEarn;
  earningRules: IEarningRule[];
  expiryRules: IExpiryRules;
  guardrails: IGuardrails;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string | null;
  activatedBy?: string | null;
}

export interface IBaseEarn {
  currency: string;
  spendAmount: number;
  points: number;
}

export interface IEarningRule {
  id: string;
  source: string;
  enabled: boolean;
  points: number;
  conditions: string;
  expiryCategory: 'purchase' | 'referral' | 'engagement';
  notes?: string;
}

export interface IExpiryRules {
  purchaseDays: number;
  referralDays: number;
  engagementDays: number;
  platinumDays: number;
  mode: 'rolling' | 'fixed';
}

export interface IGuardrails {
  minAccountAgeDaysToRedeem: number;
  minPurchasesLast30DaysToRedeem: number;
  maxRedemptionsPerMonth: number;
  maxPointsEarnedPerDay: number;
  deviceIpFlaggingEnabled: boolean;
  autoFlagRedemptionAbovePoints: number;
  autoFlagReferralsAbovePerWeek: number;
}

// Tier Configuration Interfaces

export interface ITierConfig {
  id: string;
  pointsConfigId: string;
  tiers: ITier[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ITier {
  name: string;
  minPoints: number;
  multiplier: number;
  benefits: string[];
  expiryOverrideDays: number | null;
  canGiftPoints: boolean;
  maxGiftPerMonth: number;
  downgradeRule: IDowngradeRule;
  evaluationWindowDays: number;
  active: boolean;
  color?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface IDowngradeRule {
  type: 'never' | 'after_inactive_days' | 'below_spend_threshold';
  days?: number;
  spendAmount?: number;
}

// Referral Configuration Interfaces

export interface IReferralRewardConfig {
  id: string;
  pointsConfigId: string;
  enabled: boolean;
  signupPoints: number;
  firstPurchasePoints: number;
  minPurchaseAmount: number;
  oneRewardPerReferredUser: boolean;
  slotRewards: ISlotRewards;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISlotRewards {
  slot1: ISlotReward;
  slot2: ISlotReward;
  slot3: ISlotReward;
}

export interface ISlotReward {
  title: string;
  description: string;
  quantity: number;
  value: number;
}

// Full Configuration Response

export interface IFullPointsConfig {
  pointsConfig: IPointsConfig;
  tierConfig: ITierConfig;
  referralConfig: IReferralRewardConfig;
}

// Configuration Version Summary

export interface IPointsConfigVersion {
  id: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  activatedAt?: string | null;
  activatedBy?: string | null;
}

// Create/Update Payloads

export interface ICreatePointsConfigPayload {
  pointsRules: {
    pointsEnabled: boolean;
    redemptionEnabled: boolean;
    allowStackWithDiscounts: boolean;
    baseEarn: IBaseEarn;
    earningRules: IEarningRule[];
    expiryRules: IExpiryRules;
    guardrails: IGuardrails;
  };
  tiers: ITier[];
  referral: {
    enabled: boolean;
    signupPoints: number;
    firstPurchasePoints: number;
    minPurchaseAmount: number;
    oneRewardPerReferredUser: boolean;
    slotRewards: ISlotRewards;
  };
}

// Preview Impact

export interface IPreviewImpactResponse {
  riskAssessment: IRiskAssessment;
  estimatedImpact: IEstimatedImpact;
  diffSummary: IDiffSummary;
}

export interface IRiskAssessment {
  level: 'low' | 'medium' | 'high';
  warnings: string[];
  errors: string[];
}

export interface IEstimatedImpact {
  averagePointsPerOrder: number;
  maxDailyPointsPerUser: number;
  tierDistributionEstimate: Record<string, number>;
}

export interface IDiffSummary {
  changesCount: number;
  majorChanges: string[];
  minorChanges: string[];
}

// Audit Log Interfaces

export interface IAuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserId: string;
  beforeJson: Record<string, any> | null;
  afterJson: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt?: string;
}

export interface IAuditLogQuery {
  limit?: number;
  offset?: number;
  entityType?: string;
  entityId?: string;
  action?: string;
  actorUserId?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPaginatedAuditLogs {
  data: IAuditLog[];
  total: number;
  limit: number;
  offset: number;
}
