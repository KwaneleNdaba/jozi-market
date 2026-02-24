'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input } from './Input';
import { X, Plus, Check } from 'lucide-react';
import type { Tier } from './mockData';

interface TierBenefitsTabProps {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
}

export const TierBenefitsTab: React.FC<TierBenefitsTabProps> = ({ 
  tiers, 
  onChange 
}) => {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0]?.id || '');
  const [newBenefit, setNewBenefit] = useState('');

  const selectedTier = tiers.find(t => t.id === selectedTierId);

  const updateTier = (id: string, updates: Partial<Tier>) => {
    onChange(tiers.map(tier => tier.id === id ? { ...tier, ...updates } : tier));
  };

  const addBenefit = () => {
    if (!selectedTier || !newBenefit.trim()) return;

    updateTier(selectedTier.id, {
      benefits: [...selectedTier.benefits, newBenefit.trim()]
    });
    setNewBenefit('');
  };

  const removeBenefit = (index: number) => {
    if (!selectedTier) return;

    updateTier(selectedTier.id, {
      benefits: selectedTier.benefits.filter((_, i) => i !== index)
    });
  };

  const hasBenefit = (tierId: string, benefit: string): boolean => {
    const tier = tiers.find(t => t.id === tierId);
    return tier?.benefits.includes(benefit) || false;
  };

  // Collect all unique benefits across all tiers
  const allBenefits = Array.from(new Set(tiers.flatMap(t => t.benefits)));

  return (
    <div className="space-y-6">
      {/* Tier Selector */}
      <Card>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select Tier to Manage Benefits
          </label>
          <div className="flex gap-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedTierId === tier.id
                    ? 'bg-[var(--jozi-forest)] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Badge variant={tier.color} className="text-base">
                  {tier.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Benefits Management */}
      {selectedTier && (
        <Card 
          title={`${selectedTier.name} Tier Benefits`}
          subtitle={`${selectedTier.benefits.length} benefit${selectedTier.benefits.length !== 1 ? 's' : ''} configured`}
        >
          <div className="space-y-4">
            {/* Current Benefits */}
            <div className="space-y-2">
              {selectedTier.benefits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">No benefits added yet</p>
                </div>
              ) : (
                selectedTier.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-900">{benefit}</span>
                    <button
                      onClick={() => removeBenefit(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Benefit */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Add New Benefit
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="E.g., Priority customer support"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addBenefit();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={addBenefit}
                  disabled={!newBenefit.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Benefits Comparison Matrix */}
      <Card 
        title="Benefits Comparison" 
        subtitle="Compare benefits across all tiers"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Benefit
                </th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="text-center py-3 px-4">
                    <Badge variant={tier.color}>{tier.name}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allBenefits.length === 0 ? (
                <tr>
                  <td colSpan={tiers.length + 1} className="text-center py-8 text-sm text-gray-600">
                    No benefits configured yet. Add benefits to tiers above.
                  </td>
                </tr>
              ) : (
                allBenefits.map((benefit, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {benefit}
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="text-center py-3 px-4">
                        {hasBenefit(tier.id, benefit) ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Common Benefits Library */}
      <Card 
        title="Common Benefits Library" 
        subtitle="Quick add common tier benefits"
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            'Standard email support',
            'Priority email support',
            'Dedicated account manager',
            'Free shipping on orders over R500',
            'Free shipping on all orders',
            'Early access to sales',
            'Exclusive member-only deals',
            'Birthday bonus points',
            'Anniversary rewards',
            'Points never expire',
            'Extended return period',
            'VIP customer service hotline',
          ].map((commonBenefit) => (
            <button
              key={commonBenefit}
              onClick={() => {
                if (selectedTier && !hasBenefit(selectedTier.id, commonBenefit)) {
                  updateTier(selectedTier.id, {
                    benefits: [...selectedTier.benefits, commonBenefit]
                  });
                }
              }}
              disabled={!selectedTier || hasBenefit(selectedTier.id, commonBenefit)}
              className="text-left p-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-[var(--jozi-forest)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commonBenefit}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
