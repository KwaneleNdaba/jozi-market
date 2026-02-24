'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign,
  Info,
  ChevronRight
} from 'lucide-react';
import type { IPreviewImpactResponse } from '@/interfaces/admin/points-config';

interface PreviewActivateTabProps {
  onActivate?: () => void;
  isActivating?: boolean;
  canActivate?: boolean;
  previewData?: any; // Simplified - not using IPreviewImpactResponse for mock
}

export const PreviewActivateTab: React.FC<PreviewActivateTabProps> = ({
  onActivate,
  isActivating = false,
  canActivate = false,
  previewData
}) => {
  const [showActivateModal, setShowActivateModal] = useState(false);

  // Mock preview data if none provided
  const mockPreview: any = {
    riskLevel: 'medium',
    impactSummary: {
      usersAffected: 15234,
      pointsLiabilityChange: {
        current: 1250000,
        projected: 1425000,
        percentChange: 14
      },
      tierDistributionChange: [
        { tier: 'Bronze', currentCount: 8000, projectedCount: 7800, change: -200 },
        { tier: 'Silver', currentCount: 5000, projectedCount: 5200, change: 200 },
        { tier: 'Gold', currentCount: 1800, projectedCount: 1900, change: 100 },
        { tier: 'Platinum', currentCount: 434, projectedCount: 334, change: -100 }
      ]
    },
    changes: [
      {
        category: 'Points System',
        items: [
          { field: 'Base Conversion Rate', oldValue: '0.10', newValue: '0.12', impact: 'medium' },
          { field: 'Points Enabled', oldValue: 'true', newValue: 'true', impact: 'low' }
        ]
      },
      {
        category: 'Tiers',
        items: [
          { field: 'Gold Tier Multiplier', oldValue: '2.0x', newValue: '2.5x', impact: 'high' },
          { field: 'Platinum Min Points', oldValue: '50000', newValue: '60000', impact: 'medium' }
        ]
      },
      {
        category: 'Earning Rules',
        items: [
          { field: 'Purchase Multiplier', oldValue: '1.5x', newValue: '2.0x', impact: 'high' },
          { field: 'Review Bonus Points', oldValue: '50', newValue: '100', impact: 'low' }
        ]
      },
      {
        category: 'Expiry Rules',
        items: [
          { field: 'Expiry Mode', oldValue: 'Rolling 12 months', newValue: 'Rolling 18 months', impact: 'medium' }
        ]
      }
    ],
    recommendations: [
      'Consider gradual rollout due to medium risk level',
      'Monitor points liability closely in first 30 days',
      'Prepare customer communication about tier changes',
      'Set up alerts for abuse detection'
    ]
  };

  const preview = previewData || mockPreview;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle2 className="w-5 h-5" />;
      case 'medium': return <Info className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivateClick = () => {
    setShowActivateModal(true);
  };

  const handleConfirmActivate = () => {
    setShowActivateModal(false);
    onActivate?.();
  };

  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${getRiskColor(preview.riskLevel)}`}>
          {getRiskIcon(preview.riskLevel)}
          <div className="flex-1">
            <div className="font-semibold capitalize">{preview.riskLevel} Risk Configuration</div>
            <div className="text-sm mt-1">
              {preview.riskLevel === 'low' && 'This configuration has minimal impact on the system.'}
              {preview.riskLevel === 'medium' && 'This configuration has moderate impact. Review changes carefully.'}
              {preview.riskLevel === 'high' && 'This configuration has significant impact. Proceed with caution.'}
            </div>
          </div>
        </div>
      </Card>

      {/* Estimated Impact */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Estimated Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users Affected */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Users Affected</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {preview.impactSummary.usersAffected.toLocaleString()}
            </div>
          </div>

          {/* Points Liability */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">Points Liability</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {preview.impactSummary.pointsLiabilityChange.percentChange > 0 ? '+' : ''}
              {preview.impactSummary.pointsLiabilityChange.percentChange}%
            </div>
            <div className="text-sm text-purple-700 mt-1">
              R{(preview.impactSummary.pointsLiabilityChange.projected / 100).toLocaleString()} projected
            </div>
          </div>

          {/* Tier Changes */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Tier Movements</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {preview.impactSummary.tierDistributionChange
                .reduce((sum: number, tier: any) => sum + Math.abs(tier.change), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-green-700 mt-1">users changing tiers</div>
          </div>
        </div>

        {/* Tier Distribution Chart */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Tier Distribution Changes</h4>
          <div className="space-y-3">
            {preview.impactSummary.tierDistributionChange.map((tier: any) => (
              <div key={tier.tier} className="flex items-center gap-4">
                <div className="w-24 font-medium text-sm">{tier.tier}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(tier.currentCount / 15234) * 100}%` }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(tier.projectedCount / 15234) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className={`w-20 text-sm font-medium ${tier.change > 0 ? 'text-green-600' : tier.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {tier.change > 0 ? '+' : ''}{tier.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Configuration Changes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration Changes</h3>
        <div className="space-y-4">
          {preview.changes.map((category: any, idx: number) => (
            <div key={idx} className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-semibold text-blue-900 mb-2">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="flex items-start gap-3 text-sm">
                    <div className="flex-1">
                      <div className="font-medium">{item.field}</div>
                      <div className="text-gray-600 mt-1">
                        <span className="line-through">{item.oldValue}</span>
                        {' → '}
                        <span className="font-semibold text-blue-600">{item.newValue}</span>
                      </div>
                    </div>
                    <Badge className={getImpactColor(item.impact)}>
                      {item.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {preview.recommendations.map((rec: any, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Activate Button */}
      {canActivate && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Activate?</h3>
              <p className="text-sm text-gray-600 mt-1">
                This will make the configuration live for all users immediately.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleActivateClick}
              disabled={isActivating}
            >
              {isActivating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Activating...
                </>
              ) : (
                'Activate Configuration'
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Activate Confirmation Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        title="Activate Configuration?"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to activate this configuration? This action will:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Make this configuration live for all users</li>
            <li>Deactivate the current active configuration</li>
            <li>Apply all changes immediately</li>
            <li>Log this action in the audit trail</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. Make sure you've reviewed all changes carefully.
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowActivateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmActivate}
              disabled={isActivating}
            >
              {isActivating ? 'Activating...' : 'Confirm Activation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
