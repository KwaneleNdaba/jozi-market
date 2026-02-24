// Mock data types and initial configuration

export interface PointsConfig {
  enabled: boolean;
  allowRedemption: boolean;
  allowStacking: boolean;
  isActive: boolean; // Whether config is activated
  version: number;
}

export interface EarningRule {
  id: string;
  source: string;
  enabled: boolean;
  points: number;
  conditions: string;
  expiryType: 'purchase' | 'referral' | 'engagement';
  notes: string;
}

export interface ExpiryRule {
  purchasePointsDays: number;
  referralPointsDays: number;
  engagementPointsDays: number;
  platinumPointsDays: number;
  rollingExpiry: boolean;
}

export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  multiplier: number;
  benefits: string[];
  expiryOverrideDays: number | null;
  canGiftPoints: boolean;
  status: 'active' | 'inactive';
  color: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface ReferralConfig {
  enabled: boolean;
  signupPoints: number;
  firstPurchasePoints: number;
  minPurchaseThreshold: number;
  oneRewardPerUser: boolean;
}

export interface CampaignConfig {
  bonusForFeaturedVendors: boolean;
  campaignMultiplier: number;
}

export interface GuardrailsConfig {
  accountAgeRequiredDays: number;
  minPurchaseCount30Days: number;
  maxRedemptionsPerMonth: number;
  maxPointsEarnedPerDay: number;
  deviceIpFlagging: boolean;
  autoFlagRedemptionAbove: number;
  autoFlagReferralPerWeek: number;
}

export interface ChangeLogEntry {
  setting: string;
  oldValue: string;
  newValue: string;
  impact: 'Low' | 'Medium' | 'High';
}

// Mock initial data
export const initialPointsConfig: PointsConfig = {
  enabled: true,
  allowRedemption: true,
  allowStacking: false,
  isActive: false,
  version: 0,
};

export const initialEarningRules: EarningRule[] = [
  {
    id: '1',
    source: 'Purchase',
    enabled: true,
    points: 1,
    conditions: 'Per R1 spent',
    expiryType: 'purchase',
    notes: 'Base earning rate',
  },
  {
    id: '2',
    source: 'Referral Signup',
    enabled: true,
    points: 50,
    conditions: 'Friend signs up',
    expiryType: 'referral',
    notes: 'One-time reward',
  },
  {
    id: '3',
    source: 'Referral First Purchase',
    enabled: true,
    points: 100,
    conditions: 'Friend makes first purchase over R150',
    expiryType: 'referral',
    notes: 'Requires minimum purchase',
  },
  {
    id: '4',
    source: 'Review',
    enabled: true,
    points: 25,
    conditions: 'Write verified review',
    expiryType: 'engagement',
    notes: 'Max 5 per month',
  },
  {
    id: '5',
    source: 'Profile Completion',
    enabled: true,
    points: 50,
    conditions: '100% profile filled',
    expiryType: 'engagement',
    notes: 'One-time bonus',
  },
  {
    id: '6',
    source: 'Campaign Bonus',
    enabled: false,
    points: 0,
    conditions: 'Featured vendor purchase',
    expiryType: 'purchase',
    notes: 'Multiplier-based',
  },
];

export const initialExpiryRules: ExpiryRule = {
  purchasePointsDays: 365,
  referralPointsDays: 180,
  engagementPointsDays: 90,
  platinumPointsDays: 0, // Never expire
  rollingExpiry: true,
};

export const initialTiers: Tier[] = [
  {
    id: '1',
    name: 'Bronze',
    minPoints: 0,
    multiplier: 1.0,
    benefits: ['Standard support', 'Points earning'],
    expiryOverrideDays: null,
    canGiftPoints: false,
    status: 'active',
    color: 'bronze',
  },
  {
    id: '2',
    name: 'Silver',
    minPoints: 1000,
    multiplier: 1.2,
    benefits: ['Priority support', '20% bonus points', 'Free shipping on R500+'],
    expiryOverrideDays: null,
    canGiftPoints: false,
    status: 'active',
    color: 'silver',
  },
  {
    id: '3',
    name: 'Gold',
    minPoints: 5000,
    multiplier: 1.5,
    benefits: ['VIP support', '50% bonus points', 'Free shipping', 'Early access'],
    expiryOverrideDays: null,
    canGiftPoints: true,
    status: 'active',
    color: 'gold',
  },
  {
    id: '4',
    name: 'Platinum',
    minPoints: 15000,
    multiplier: 2.0,
    benefits: ['Dedicated manager', '2x points', 'Free shipping', 'Exclusive deals', 'Points never expire'],
    expiryOverrideDays: 0,
    canGiftPoints: true,
    status: 'active',
    color: 'platinum',
  },
];

export const initialReferralConfig: ReferralConfig = {
  enabled: true,
  signupPoints: 50,
  firstPurchasePoints: 100,
  minPurchaseThreshold: 150,
  oneRewardPerUser: true,
};

export const initialCampaignConfig: CampaignConfig = {
  bonusForFeaturedVendors: false,
  campaignMultiplier: 1.5,
};

export const initialGuardrails: GuardrailsConfig = {
  accountAgeRequiredDays: 7,
  minPurchaseCount30Days: 1,
  maxRedemptionsPerMonth: 5,
  maxPointsEarnedPerDay: 1000,
  deviceIpFlagging: true,
  autoFlagRedemptionAbove: 5000,
  autoFlagReferralPerWeek: 10,
};
