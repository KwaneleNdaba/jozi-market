'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Button } from './Button';
import { HelpTooltip } from './Tooltip';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Gift, 
  Clock, 
  ShieldAlert,
  X
} from 'lucide-react';
import { 
  getAllTiersAction,
  createTierAction, 
  updateTierAction, 
  deleteTierAction,
  activateTierAction,
  deactivateTierAction
} from '@/app/actions/points';
import type { ITier, ICreateTier } from '@/interfaces/points/points';

// --- Internal Sub-components for Cleaner UI ---

// 1. Two-step Delete Button to replace Modal
const DeleteAction = ({ onDelete, loading }: { onDelete: () => void; loading: boolean }) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (confirming) {
      const timer = setTimeout(() => setConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirming]);

  if (loading) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;

  if (confirming) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setConfirming(false)}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={onDelete}
          className="h-8 text-xs px-3"
        >
          Confirm
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={<Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600 transition-colors" />}
      onClick={() => setConfirming(true)}
      className="hover:bg-red-50"
    >
      <span className="sr-only">Delete</span>
    </Button>
  );
};

// 2. Auto-saving Input to remove manual "Save" buttons
const AutoSaveInput = ({ 
  value, 
  onSave, 
  type = "text", 
  min, 
  step,
  max,
  className, 
  suffix,
  disabled 
}: { 
  value: string | number; 
  onSave: (val: string | number) => void;
  type?: string;
  min?: string;
  step?: string;
  max?: string;
  className?: string;
  suffix?: string;
  disabled?: boolean;
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (isDirty) {
      onSave(localValue);
      setIsDirty(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
    setLocalValue(newVal);
    setIsDirty(true);
  };

  return (
    <div className="relative">
      <Input
        type={type}
        min={min}
        step={step}
        max={max}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        suffix={suffix}
        disabled={disabled}
      />
      {isDirty && (
        <span className="absolute right-2 top-2 w-1.5 h-1.5 bg-yellow-400 rounded-full" title="Unsaved changes" />
      )}
    </div>
  );
};

// --- Main Component ---

export const TiersTab: React.FC = () => {
  const [tiers, setTiers] = useState<ITier[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Stores ID of tier being modified
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    setLoading(true);
    try {
      const response = await getAllTiersAction();
      if (response.error) setError(response.message);
      else if (response.data) {
        // Sort tiers by tierLevel ascending (1, 2, 3, 4...)
        const sortedTiers = response.data.sort((a, b) => a.tierLevel - b.tierLevel);
        setTiers(sortedTiers);
      }
    } catch (err) {
      console.error('[TiersTab] Error loading:', err);
      setError('Failed to load tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  // Direct Create Action (No Modal)
  const handleCreateTier = async () => {
    setActionLoading('create');
    try {
      const newTierData: ICreateTier = {
        name: `Tier ${tiers.length + 1}`,
        tierLevel: tiers.length + 1,
        color: '#6B7280',
        minPoints: 0,
        multiplier: 1.0,
        canGiftPoints: false,
        maxGiftPerMonth: 0,
        expiryOverrideDays: null,
        downgradeType: 'after_inactive_days',
        downgradeDays: 90,
        evaluationWindowDays: 365,
        active: true,
      };

      const response = await createTierAction(newTierData);
      
      if (response.error) {
        handleNotify('error', response.message);
      } else if (response.data) {
        await loadTiers();
        handleNotify('success', 'New tier added');
        // Automatically expand the new tier to encourage editing
        if(response.data.id) setExpandedTier(response.data.id);
      }
    } catch (err) {
      handleNotify('error', 'Failed to create tier');
    } finally {
      setActionLoading(null);
    }
  };

  // Direct Update Action (Auto-save)
  const handleUpdateTier = async (tierId: string, updates: Partial<ITier>) => {
    // Validate tierLevel doesn't exceed total number of tiers
    if ('tierLevel' in updates && updates.tierLevel) {
      const maxLevel = tiers.length;
      if (updates.tierLevel > maxLevel) {
        handleNotify('error', `Tier level cannot exceed ${maxLevel} (total number of tiers)`);
        return;
      }
      if (updates.tierLevel < 1) {
        handleNotify('error', 'Tier level must be at least 1');
        return;
      }
    }

    // Optimistic UI Update
    const updatedTiers = tiers.map(t => t.id === tierId ? { ...t, ...updates } : t);
    // Re-sort if tierLevel was updated
    if ('tierLevel' in updates) {
      updatedTiers.sort((a, b) => a.tierLevel - b.tierLevel);
    }
    setTiers(updatedTiers);
    setActionLoading(tierId);
    
    try {
      const response = await updateTierAction(tierId, updates);
      if (response.error) {
        handleNotify('error', response.message);
        await loadTiers(); // Revert on error
      }
    } catch (err) {
      handleNotify('error', 'Update failed');
      await loadTiers(); // Revert on error
    } finally {
      setActionLoading(null);
    }
  };

  // Direct Delete Action (No Modal, uses inline confirm)
  const handleDeleteTier = async (tierId: string) => {
    setActionLoading(tierId);
    try {
      const response = await deleteTierAction(tierId);
      if (response.error) {
        handleNotify('error', response.message);
      } else {
        setTiers(prev => prev.filter(t => t.id !== tierId));
        handleNotify('success', 'Tier removed');
      }
    } catch (err) {
      handleNotify('error', 'Failed to delete tier');
    } finally {
      setActionLoading(null);
    }
  };

  // Status Toggle Wrapper
  const handleToggleActive = async (tierId: string, isActive: boolean) => {
    setActionLoading(tierId);
    try {
      const response = isActive 
        ? await deactivateTierAction(tierId)
        : await activateTierAction(tierId);

      if (response.error) {
        handleNotify('error', response.message);
      } else {
        await loadTiers(); // Reload to ensure state consistency
      }
    } catch (err) {
      handleNotify('error', 'Status change failed');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTier(curr => curr === id ? null : id);
  };

  // --- Table Columns Configuration ---
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '3%',
      render: () => <GripVertical className="w-4 h-4 text-gray-300 cursor-grab hover:text-gray-500" />,
    },
    {
      key: 'tierLevel',
      header: 'Level',
      width: '8%',
      render: (tier: ITier) => (
        <AutoSaveInput
          type="number"
          min="1"
          max={String(tiers.length)}
          value={tier.tierLevel}
          onSave={(val) => handleUpdateTier(tier.id, { tierLevel: Number(val) })}
          className="w-16"
        />
      ),
    },
    {
      key: 'name',
      header: 'Tier Identity',
      width: '18%',
      render: (tier: ITier) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="color" 
              value={tier.color || '#6B7280'}
              onChange={(e) => handleUpdateTier(tier.id, { color: e.target.value })}
              className="w-6 h-6 rounded-full overflow-hidden border-none p-0 cursor-pointer opacity-0 absolute inset-0 z-10"
              title="Change Tier Color"
            />
            <div 
              className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform group-hover:scale-110" 
              style={{ backgroundColor: tier.color || '#6B7280' }}
            />
          </div>
          <AutoSaveInput
            value={tier.name}
            onSave={(val) => handleUpdateTier(tier.id, { name: String(val) })}
            className="w-full min-w-[120px]"
          />
        </div>
      ),
    },
    {
      key: 'minPoints',
      header: 'Min Points',
      width: '15%',
      render: (tier: ITier) => (
        <AutoSaveInput
          type="number"
          min="0"
          value={tier.minPoints}
          onSave={(val) => handleUpdateTier(tier.id, { minPoints: Number(val) })}
          className="w-24"
        />
      ),
    },
    {
      key: 'multiplier',
      header: 'Multiplier',
      width: '12%',
      render: (tier: ITier) => (
        <AutoSaveInput
          type="number"
          min="1"
          step="0.1"
          suffix="x"
          value={tier.multiplier}
          onSave={(val) => handleUpdateTier(tier.id, { multiplier: Number(val) })}
          className="w-20"
        />
      ),
    },
    {
      key: 'config',
      header: 'Configuration',
      width: '20%',
      render: (tier: ITier) => (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className={`flex items-center gap-1.5 ${tier.canGiftPoints ? 'text-[var(--jozi-forest)] font-medium' : ''}`}>
            <Gift className="w-3.5 h-3.5" />
            <span>{tier.canGiftPoints ? 'Gifting' : 'No Gift'}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${tier.expiryOverrideDays === 0 ? 'text-amber-600 font-medium' : ''}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>
              {tier.expiryOverrideDays === null ? 'Default' : 
               tier.expiryOverrideDays === 0 ? 'No Expiry' : 
               `${tier.expiryOverrideDays}d`}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      render: (tier: ITier) => (
        <Toggle
          checked={tier.active}
          onChange={() => handleToggleActive(tier.id, tier.active)}
          disabled={actionLoading === tier.id}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '10%',
      render: (tier: ITier) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(tier.id)}
            className={`transition-transform duration-200 ${expandedTier === tier.id ? 'bg-gray-100' : ''}`}
            icon={expandedTier === tier.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          >
            <span className="sr-only">Toggle details</span>
          </Button>
          <DeleteAction 
            onDelete={() => handleDeleteTier(tier.id)} 
            loading={actionLoading === tier.id}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {error && (
          <div className="pointer-events-auto flex items-center gap-2 p-3 bg-white border-l-4 border-red-500 shadow-lg rounded animate-in slide-in-from-right">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-800">{error}</span>
          </div>
        )}
        {success && (
          <div className="pointer-events-auto flex items-center gap-2 p-3 bg-white border-l-4 border-green-500 shadow-lg rounded animate-in slide-in-from-right">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-800">{success}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--jozi-forest)]" />
        </div>
      ) : (
        <Card 
          title="Loyalty Tiers" 
          subtitle="Manage point multipliers and tier benefits"
          actions={
            <div className="flex items-center gap-3">
               <HelpTooltip content="Tiers are automatically assigned based on user point balance." />
              <Button
                variant="primary"
                size="sm"
                icon={actionLoading === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                onClick={handleCreateTier}
                disabled={actionLoading !== null}
              >
                Add Tier
              </Button>
            </div>
          }
        >
          <div className="min-w-full">
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[3%_8%_18%_15%_12%_20%_10%_10%] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div></div>
                <div>Level</div>
                <div>Tier Identity</div>
                <div>Min Points</div>
                <div>Multiplier</div>
                <div>Configuration</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {tiers.map((tier) => (
                  <div key={tier.id} className="group bg-white transition-colors hover:bg-gray-50/50">
                    {/* Main Row Content */}
                    <div className="grid grid-cols-[3%_8%_18%_15%_12%_20%_10%_10%] gap-4 px-6 py-4 items-center">
                      {columns.map((col, idx) => (
                        <div key={`${tier.id}-${idx}`} className="flex items-center">
                          {col.render(tier)}
                        </div>
                      ))}
                    </div>

                    {/* Expandable Details Panel */}
                    {expandedTier === tier.id && (
                      <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-3 gap-8">
                          
                          {/* 1. Expiry Configuration */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <h3>Expiry Override</h3>
                            </div>
                            <div className="space-y-2 pl-6">
                              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                                <input
                                  type="radio"
                                  name={`expiry-${tier.id}`}
                                  checked={tier.expiryOverrideDays === null}
                                  onChange={() => handleUpdateTier(tier.id, { expiryOverrideDays: null })}
                                  className="text-[var(--jozi-forest)] focus:ring-[var(--jozi-forest)]"
                                />
                                Use system default
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                                <input
                                  type="radio"
                                  name={`expiry-${tier.id}`}
                                  checked={tier.expiryOverrideDays === 0}
                                  onChange={() => handleUpdateTier(tier.id, { expiryOverrideDays: 0 })}
                                  className="text-[var(--jozi-forest)] focus:ring-[var(--jozi-forest)]"
                                />
                                Never expire (Premium)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`expiry-${tier.id}`}
                                  checked={tier.expiryOverrideDays !== null && tier.expiryOverrideDays !== undefined && tier.expiryOverrideDays > 0}
                                  onChange={() => handleUpdateTier(tier.id, { expiryOverrideDays: 365 })}
                                  className="text-[var(--jozi-forest)] focus:ring-[var(--jozi-forest)]"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Custom days:</span>
                                  <AutoSaveInput
                                    type="number"
                                    min="1"
                                    value={tier.expiryOverrideDays || 365}
                                    onSave={(val) => handleUpdateTier(tier.id, { expiryOverrideDays: Number(val) })}
                                    disabled={tier.expiryOverrideDays === null || tier.expiryOverrideDays === 0}
                                    className="w-20 h-8 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Gifting Rules */}
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
                              <Gift className="w-4 h-4 text-gray-500" />
                              <h3>Gifting Capabilities</h3>
                            </div>
                            <div className="space-y-4 pl-6">
                              <Toggle
                                label="Allow Point Gifting"
                                checked={tier.canGiftPoints}
                                onChange={(checked) => handleUpdateTier(tier.id, { canGiftPoints: checked })}
                              />
                              <div className={`transition-opacity ${!tier.canGiftPoints ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                                <p className="text-xs text-gray-500 mb-1">Max points per month</p>
                                <AutoSaveInput
                                  type="number"
                                  min="0"
                                  value={tier.maxGiftPerMonth || 0}
                                  onSave={(val) => handleUpdateTier(tier.id, { maxGiftPerMonth: Number(val) })}
                                  className="w-full h-8 text-sm"
                                  disabled={!tier.canGiftPoints}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 3. Downgrade Logic */}
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
                              <ShieldAlert className="w-4 h-4 text-gray-500" />
                              <h3>Retention & Downgrade</h3>
                            </div>
                            <div className="space-y-3 pl-6">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Evaluation Window (Days)</p>
                                <AutoSaveInput
                                  type="number"
                                  value={tier.evaluationWindowDays}
                                  onSave={(val) => handleUpdateTier(tier.id, { evaluationWindowDays: Number(val) })}
                                  className="w-full h-8 text-sm"
                                  suffix="days"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Inactive Downgrade</p>
                                <AutoSaveInput
                                  type="number"
                                  value={tier.downgradeDays}
                                  onSave={(val) => handleUpdateTier(tier.id, { downgradeDays: Number(val) })}
                                  className="w-full h-8 text-sm"
                                  suffix="days"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {tiers.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No tiers configured. Click "Add Tier" to start.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};