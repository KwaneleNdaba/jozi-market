'use client';

import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Coins,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Gift
} from 'lucide-react';
import type { IFullPointsConfig } from '@/interfaces/admin/points-config';

interface OverviewTabProps {
  config: IFullPointsConfig;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ config }) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    switch (config.pointsConfig.status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'archived':
        return <Badge variant="default">Inactive</Badge>;
    }
  };

  const getRiskLevel = () => {
    const guardrails = config.pointsConfig.guardrails;
    let riskScore = 0;

    if (guardrails.minAccountAgeDaysToRedeem < 7) riskScore += 3;
    if (guardrails.maxPointsEarnedPerDay > 2000) riskScore += 2;
    if (!guardrails.deviceIpFlaggingEnabled) riskScore += 2;

    if (riskScore <= 3) return { level: 'Low', variant: 'success' as const };
    if (riskScore <= 6) return { level: 'Medium', variant: 'warning' as const };
    return { level: 'High', variant: 'error' as const };
  };

  const risk = getRiskLevel();

  return (
    <div className="space-y-6">
      {/* Version Information */}
      <Card title="Version Information">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Version</p>
            <p className="text-lg font-semibold text-gray-900">
              Version {config.pointsConfig.version}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <div className="mt-1">{getStatusBadge()}</div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Created By</p>
            <p className="text-sm font-medium text-gray-900">{config.pointsConfig.createdBy}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Created At</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(config.pointsConfig.createdAt)}
            </p>
          </div>
          {config.pointsConfig.activatedAt && (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-1">Activated By</p>
                <p className="text-sm font-medium text-gray-900">{config.pointsConfig.activatedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Activated At</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(config.pointsConfig.activatedAt)}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Points Status</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {config.pointsConfig.pointsEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Redemption: {config.pointsConfig.redemptionEnabled ? 'On' : 'Off'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              risk.variant === 'success' ? 'bg-emerald-100' : 
              risk.variant === 'warning' ? 'bg-amber-100' : 'bg-rose-100'
            }`}>
              <Shield className={`w-6 h-6 ${
                risk.variant === 'success' ? 'text-emerald-600' : 
                risk.variant === 'warning' ? 'text-amber-600' : 'text-rose-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Abuse Risk Level</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{risk.level}</p>
              <Badge variant={risk.variant} className="mt-1">{risk.level} Risk</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Details */}
      <div className="grid grid-cols-2 gap-6">
        <Card title="Tiers Configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active Tiers</span>
              <span className="text-lg font-bold text-gray-900">
                {config.tierConfig.tiers.filter(t => t.active).length}
              </span>
            </div>
            <div className="space-y-3">
              {config.tierConfig.tiers.map((tier, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={tier.color}>{tier.name}</Badge>
                    <span className="text-sm text-gray-600">
                      {tier.minPoints.toLocaleString()}+ pts
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {tier.multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Top Earning Rules">
          <div className="space-y-3">
            {config.pointsConfig.earningRules
              .filter(rule => rule.enabled)
              .slice(0, 5)
              .map((rule, index) => (
                <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{rule.source}</p>
                    <p className="text-xs text-gray-600">{rule.conditions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--jozi-forest)]">
                      {rule.points} pts
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Referral Program */}
      <Card title="Referral Program">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            {config.referralConfig.enabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className="text-sm text-gray-600">Program Status</p>
              <p className="text-sm font-semibold text-gray-900">
                {config.referralConfig.enabled ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Signup Bonus</p>
            <p className="text-lg font-bold text-gray-900">
              {config.referralConfig.signupPoints} pts
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">First Purchase Bonus</p>
            <p className="text-lg font-bold text-gray-900">
              {config.referralConfig.firstPurchasePoints} pts
            </p>
          </div>
        </div>
      </Card>

      {/* Important Settings */}
      <Card title="Important Settings">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Points Expiry</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase Points</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.expiryRules.purchaseDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referral Points</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.expiryRules.referralDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Points</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.expiryRules.engagementDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Mode</span>
                <Badge variant="info">
                  {config.pointsConfig.expiryRules.mode === 'rolling' ? 'Rolling' : 'Fixed'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Security & Guardrails</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Account Age</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.guardrails.minAccountAgeDaysToRedeem} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Daily Earning</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.guardrails.maxPointsEarnedPerDay.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Monthly Redemptions</span>
                <span className="font-medium text-gray-900">
                  {config.pointsConfig.guardrails.maxRedemptionsPerMonth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IP/Device Flagging</span>
                <Badge variant={config.pointsConfig.guardrails.deviceIpFlaggingEnabled ? 'success' : 'error'}>
                  {config.pointsConfig.guardrails.deviceIpFlaggingEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
