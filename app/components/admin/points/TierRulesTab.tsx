'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Select } from './Select';
import { Badge } from './Badge';
import { Button } from './Button';
import { HelpTooltip } from './Tooltip';
import { Plus, GripVertical, Gift } from 'lucide-react';
import type { Tier } from './mockData';

interface TierRulesTabProps {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
  onRequestConfirmation: (action: 'disable-points-system' | 'change-conversion-rate' | 'change-tier-multiplier', callback: () => void) => void;
}

export const TierRulesTab: React.FC<TierRulesTabProps> = ({ 
  tiers, 
  onChange,
  onRequestConfirmation 
}) => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const updateTier = (id: string, updates: Partial<Tier>) => {
    onChange(tiers.map(tier => tier.id === id ? { ...tier, ...updates } : tier));
  };

  const addBenefit = (tierId: string, benefit: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (tier && benefit.trim()) {
      updateTier(tierId, { 
        benefits: [...tier.benefits, benefit.trim()] 
      });
    }
  };

  const removeBenefit = (tierId: string, index: number) => {
    const tier = tiers.find(t => t.id === tierId);
    if (tier) {
      updateTier(tierId, { 
        benefits: tier.benefits.filter((_, i) => i !== index) 
      });
    }
  };

  const columns = [
    {
      key: 'drag',
      header: '',
      width: '3%',
      render: () => (
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
      ),
    },
    {
      key: 'name',
      header: 'Tier Name',
      width: '15%',
      render: (tier: Tier) => (
        <div className="flex items-center gap-2">
          <Badge variant={tier.color}>{tier.name}</Badge>
        </div>
      ),
    },
    {
      key: 'minPoints',
      header: 'Min Points',
      width: '12%',
      render: (tier: Tier) => (
        <Input
          type="number"
          min="0"
          value={tier.minPoints}
          onChange={(e) => updateTier(tier.id, { minPoints: parseInt(e.target.value) || 0 })}
          className="w-28"
        />
      ),
    },
    {
      key: 'multiplier',
      header: 'Multiplier',
      width: '12%',
      render: (tier: Tier) => (
        <Input
          type="number"
          min="1"
          step="0.1"
          value={tier.multiplier}
          onChange={(e) => updateTier(tier.id, { multiplier: parseFloat(e.target.value) || 1 })}
          suffix="x"
          className="w-24"
        />
      ),
    },
    {
      key: 'benefits',
      header: 'Benefits',
      width: '25%',
      render: (tier: Tier) => (
        <div className="flex flex-wrap gap-1">
          {tier.benefits.slice(0, 3).map((benefit, i) => (
            <Badge key={i} variant="default" className="text-xs">
              {benefit.length > 20 ? `${benefit.slice(0, 20)}...` : benefit}
            </Badge>
          ))}
          {tier.benefits.length > 3 && (
            <Badge variant="info" className="text-xs">+{tier.benefits.length - 3} more</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'expiryOverride',
      header: 'Expiry Override',
      width: '12%',
      render: (tier: Tier) => (
        <span className="text-sm text-gray-600">
          {tier.expiryOverrideDays === null ? 'Default' : tier.expiryOverrideDays === 0 ? 'Never' : `${tier.expiryOverrideDays}d`}
        </span>
      ),
    },
    {
      key: 'canGift',
      header: 'Can Gift',
      width: '10%',
      render: (tier: Tier) => (
        <Toggle
          checked={tier.canGiftPoints}
          onChange={(checked) => updateTier(tier.id, { canGiftPoints: checked })}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '11%',
      render: (tier: Tier) => (
        <Toggle
          checked={tier.status === 'active'}
          onChange={(checked) => updateTier(tier.id, { status: checked ? 'active' : 'inactive' })}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tier Table */}
      <Card 
        title="Customer Tiers" 
        subtitle="Define progression tiers and their benefits"
        actions={
          <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Tier
          </Button>
        }
      >
        <Table 
          columns={columns} 
          data={tiers}
        />
        <p className="text-xs text-gray-500 mt-4">
          Drag rows to reorder tiers. Min Points determine tier qualification (lifetime or rolling).
        </p>
      </Card>

      {/* Tier Details Panel */}
      <Card title="Tier Configuration" subtitle="Select a tier from the table above to edit details">
        <div className="space-y-4">
          <Select
            label="Select Tier"
            value={selectedTier?.id || ''}
            onChange={(id) => setSelectedTier(tiers.find(t => t.id === id) || null)}
            options={[
              { value: '', label: 'Choose a tier...' },
              ...tiers.map(t => ({ value: t.id, label: t.name }))
            ]}
          />

          {selectedTier && (
            <div className="space-y-6 pt-4 border-t border-gray-200">
              {/* Tier Badge Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Badge Preview</label>
                <Badge variant={selectedTier.color} className="text-lg px-4 py-2">
                  {selectedTier.name}
                </Badge>
              </div>

              {/* Benefits Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Benefits
                  <HelpTooltip content="Add benefits that customers get when they reach this tier" />
                </label>
                <div className="space-y-2">
                  {selectedTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...selectedTier.benefits];
                          newBenefits[index] = e.target.value;
                          updateTier(selectedTier.id, { benefits: newBenefits });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(selectedTier.id, index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => addBenefit(selectedTier.id, 'New benefit')}
                  >
                    Add Benefit
                  </Button>
                </div>
              </div>

              {/* Gift Points Settings */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-[var(--jozi-gold)]" />
                  <h4 className="text-sm font-semibold text-gray-900">Gift Points Settings</h4>
                </div>
                
                <div className="space-y-4">
                  <Toggle
                    checked={selectedTier.canGiftPoints}
                    onChange={(checked) => updateTier(selectedTier.id, { canGiftPoints: checked })}
                    label="Enable Point Gifting"
                    description="Allow customers in this tier to gift points to other users"
                  />
                  
                  {selectedTier.canGiftPoints && (
                    <div className="pl-9 space-y-4">
                      <Input
                        label="Max Gift Per Month"
                        type="number"
                        min="0"
                        defaultValue={1000}
                        suffix="points"
                        description="Maximum points this tier can gift per calendar month"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tier Management */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Tier Management</h4>
                <div className="space-y-4">
                  <Select
                    label="Tier Downgrade Rule"
                    value="90days"
                    onChange={() => {}}
                    options={[
                      { value: 'immediate', label: 'Immediate (if points fall below threshold)' },
                      { value: '30days', label: 'After 30 days inactive' },
                      { value: '60days', label: 'After 60 days inactive' },
                      { value: '90days', label: 'After 90 days inactive' },
                      { value: 'never', label: 'Never downgrade' },
                    ]}
                    description="When to downgrade a customer if they no longer meet requirements"
                  />
                  
                  <Select
                    label="Tier Evaluation Window"
                    value="rolling"
                    onChange={() => {}}
                    options={[
                      { value: 'lifetime', label: 'Lifetime points' },
                      { value: 'rolling', label: 'Rolling 12 months' },
                      { value: '90days', label: 'Rolling 90 days' },
                      { value: '30days', label: 'Rolling 30 days' },
                    ]}
                    description="How to calculate points for tier qualification"
                  />

                  <Input
                    label="Points Expiry Override"
                    type="number"
                    min="0"
                    value={selectedTier.expiryOverrideDays || 0}
                    onChange={(e) => updateTier(selectedTier.id, { expiryOverrideDays: parseInt(e.target.value) || null })}
                    suffix="days"
                    description="Override default expiry rules for this tier. Set 0 for never expire, or leave blank for default."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
