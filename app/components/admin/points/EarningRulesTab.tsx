'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Button } from './Button';
import { HelpTooltip } from './Tooltip';
import { 
  getAllEarningRulesAction, 
  getAllExpiryRulesAction,
  createEarningRuleAction,
  updateEarningRuleAction,
  deleteEarningRuleAction,
  enableEarningRuleAction,
  disableEarningRuleAction
} from '@/app/actions/points';
import type { IEarningRule, IExpiryRule, ICreateEarningRule, SourceType } from '@/interfaces/points/points';
import { 
  Zap, 
  Trash2, 
  Plus, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  Users, 
  Star, 
  Gift, 
  Megaphone, 
  UserPlus, 
  AlertCircle,
  CheckCircle,
  FileText,
  Clock,
  X
} from 'lucide-react';

// --- Helper Components ---

// 1. Auto-saving Input
const AutoSaveInput = ({ 
  value, 
  onSave, 
  type = "text", 
  min, 
  className, 
  placeholder,
  disabled 
}: { 
  value: string | number; 
  onSave: (val: string | number) => void;
  type?: string;
  min?: string;
  className?: string;
  placeholder?: string;
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
    <div className="relative w-full">
      <Input
        type={type}
        min={min}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
      />
      {isDirty && (
        <span className="absolute right-2 top-2.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" title="Unsaved changes" />
      )}
    </div>
  );
};

// 2. Inline Delete Confirmation
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
      {null}
    </Button>
  );
};

// 3. Source Icon Helper
const SourceIcon = ({ type }: { type: SourceType }) => {
  const iconProps = { className: "w-4 h-4" };
  switch (type) {
    case 'purchase': return <ShoppingCart {...iconProps} className="w-4 h-4 text-blue-600" />;
    case 'referral': return <Users {...iconProps} className="w-4 h-4 text-purple-600" />;
    case 'review': return <Star {...iconProps} className="w-4 h-4 text-amber-600" />;
    case 'signup': return <UserPlus {...iconProps} className="w-4 h-4 text-green-600" />;
    case 'campaign': return <Megaphone {...iconProps} className="w-4 h-4 text-rose-600" />;
    case 'bonus': return <Gift {...iconProps} className="w-4 h-4 text-indigo-600" />;
    default: return <Zap {...iconProps} className="w-4 h-4 text-gray-600" />;
  }
};

const sourceTypeOptions: { value: SourceType; label: string }[] = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'referral', label: 'Referral' },
  { value: 'review', label: 'Review' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'signup', label: 'Sign Up' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'bonus', label: 'Bonus' },
];

interface EarningRulesTabProps {
  campaignConfig?: any;
  onCampaignConfigChange?: (config: any) => void;
}

export const EarningRulesTab: React.FC<EarningRulesTabProps> = () => {
  const [earningRules, setEarningRules] = useState<IEarningRule[]>([]);
  const [expiryRules, setExpiryRules] = useState<IExpiryRule[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rulesResponse, expiryResponse] = await Promise.all([
        getAllEarningRulesAction(),
        getAllExpiryRulesAction(),
      ]);

      if (!rulesResponse.error && rulesResponse.data) {
        setEarningRules(rulesResponse.data);
      } else {
        setError(rulesResponse.message || 'Failed to load rules');
      }
      
      if (!expiryResponse.error && expiryResponse.data) {
        setExpiryRules(expiryResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Network error loading data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleCreate = async () => {
    setActionLoading('create');
    try {
      const defaultRule: ICreateEarningRule = {
        ruleName: `New Earning Rule ${earningRules.length + 1}`,
        sourceType: 'purchase',
        enabled: false,
        pointsAwarded: 1,
        expiryRuleId: expiryRules[0]?.id || '',
        description: '',
      };

      const response = await createEarningRuleAction(defaultRule);
      
      if (!response.error && response.data) {
        setEarningRules([...earningRules, response.data]);
        setExpandedRule(response.data.id); // Auto expand
        showNotification('success', 'Rule created successfully');
      } else {
        showNotification('error', response.message || 'Failed to create rule');
      }
    } catch (error) {
      showNotification('error', 'Failed to create earning rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async (ruleId: string, updates: Partial<IEarningRule>) => {
    // Optimistic update
    setEarningRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    setActionLoading(ruleId);

    try {
      const response = await updateEarningRuleAction(ruleId, updates);
      
      if (response.error) {
        showNotification('error', response.message || 'Failed to update rule');
        await loadData(); // Revert
      }
    } catch (error) {
      showNotification('error', 'Failed to update rule');
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (ruleId: string) => {
    setActionLoading(ruleId);
    try {
      const response = await deleteEarningRuleAction(ruleId);
      
      if (!response.error) {
        setEarningRules(prev => prev.filter(r => r.id !== ruleId));
        showNotification('success', 'Rule deleted successfully');
      } else {
        showNotification('error', response.message || 'Failed to delete rule');
      }
    } catch (error) {
      showNotification('error', 'Failed to delete earning rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleEnabled = async (rule: IEarningRule) => {
    setActionLoading(rule.id);
    try {
      const response = rule.enabled 
        ? await disableEarningRuleAction(rule.id)
        : await enableEarningRuleAction(rule.id);
      
      if (!response.error && response.data) {
        setEarningRules(prev => prev.map(r => r.id === rule.id ? response.data! : r));
      } else {
        showNotification('error', 'Failed to toggle status');
      }
    } catch (error) {
      showNotification('error', 'Failed to toggle status');
    } finally {
      setActionLoading(null);
    }
  };

  // --- Render ---

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

      <Card 
        title="Earning Rules" 
        subtitle="Configure how customers earn points from actions"
        actions={
          <div className="flex items-center gap-3">
            <HelpTooltip content="Define points awarded for Purchases, Referrals, and Engagement." />
            <Button 
              onClick={handleCreate} 
              variant="primary"
              size="sm"
              icon={actionLoading === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              disabled={actionLoading !== null}
            >
              Add Rule
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--jozi-forest)]" />
          </div>
        ) : (
          <div className="min-w-full">
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-[25%_15%_15%_25%_10%_10%] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div>Rule Identity</div>
                <div>Source</div>
                <div>Points</div>
                <div>Expiry Policy</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {earningRules.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 text-sm">
                    No earning rules configured. Click "Add Rule" to start.
                  </div>
                ) : (
                  earningRules.map((rule) => (
                    <div key={rule.id} className="group bg-white transition-colors hover:bg-gray-50/50">
                      
                      {/* Main Row */}
                      <div className="grid grid-cols-[25%_15%_15%_25%_10%_10%] gap-4 px-6 py-4 items-center">
                        
                        {/* 1. Identity */}
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg bg-gray-100`}>
                              <SourceIcon type={rule.sourceType} />
                           </div>
                           <AutoSaveInput
                             value={rule.ruleName}
                             onSave={(val) => handleUpdate(rule.id, { ruleName: String(val) })}
                             className="w-full font-medium"
                           />
                        </div>

                        {/* 2. Source Type Selector */}
                        <div>
                          <div className="relative">
                            <select
                              value={rule.sourceType}
                              onChange={(e) => handleUpdate(rule.id, { sourceType: e.target.value as SourceType })}
                              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[var(--jozi-forest)] focus:border-[var(--jozi-forest)] block p-2 pr-8"
                              disabled={actionLoading === rule.id}
                            >
                              {sourceTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* 3. Points */}
                        <div>
                          <AutoSaveInput
                            type="number"
                            min="0"
                            value={rule.pointsAwarded}
                            onSave={(val) => handleUpdate(rule.id, { pointsAwarded: Number(val) })}
                            className="w-24 font-semibold text-gray-900"
                          />
                        </div>

                        {/* 4. Expiry (Read-only preview) */}
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" />
                           {expiryRules.find(er => er.id === rule.expiryRuleId)?.expiryType ? (
                             <span>
                               Linked to <span className="font-medium text-gray-700 capitalize">{expiryRules.find(er => er.id === rule.expiryRuleId)?.expiryType}</span> rules
                             </span>
                           ) : (
                             <span className="text-amber-600">No expiry set</span>
                           )}
                        </div>

                        {/* 5. Status */}
                        <div>
                          <Toggle
                            checked={rule.enabled}
                            onChange={() => handleToggleEnabled(rule)}
                            disabled={actionLoading === rule.id}
                          />
                        </div>

                        {/* 6. Actions */}
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                            className={`transition-transform duration-200 ${expandedRule === rule.id ? 'bg-gray-100' : ''}`}
                            icon={expandedRule === rule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          >
                            <span className="sr-only">Toggle details</span>
                          </Button>
                          <DeleteAction 
                            onDelete={() => handleDelete(rule.id)} 
                            loading={actionLoading === rule.id}
                          />
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {expandedRule === rule.id && (
                        <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="p-5 bg-gray-50 border border-gray-100 rounded-lg shadow-inner grid grid-cols-1 gap-8">
                            
                            {/* Rule Configuration */}
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-gray-500" />
                                Rule Configuration
                              </h4>
                              <div className="space-y-3 pl-6">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Public Description (Visible to Users)</label>
                                  <AutoSaveInput
                                    value={rule.description || ''}
                                    onSave={(val) => handleUpdate(rule.id, { description: String(val) })}
                                    placeholder="e.g. Earn 10 points for every purchase over R100"
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Linked Expiry Rule</label>
                                  <div className="relative">
                                    <select
                                      value={rule.expiryRuleId}
                                      onChange={(e) => handleUpdate(rule.id, { expiryRuleId: e.target.value })}
                                      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[var(--jozi-forest)] focus:border-[var(--jozi-forest)] block p-2 pr-8"
                                    >
                                      <option value="">-- Select Expiry Logic --</option>
                                      {expiryRules.map(er => (
                                        <option key={er.id} value={er.id}>
                                          {er.expiryType.charAt(0).toUpperCase() + er.expiryType.slice(1)} ({er.expiryDays} days - {er.expiryMode})
                                        </option>
                                      ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                      <ChevronDown className="h-4 w-4" />
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-1">
                                    Points earned via this rule will follow the expiry logic selected above.
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card title="Earning Logic & Calculations" className="bg-gradient-to-br from-white to-blue-50/50">
        <div className="flex gap-6 items-start">
           <div className="hidden md:flex p-3 bg-blue-100 rounded-full shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
           </div>
           <div className="space-y-4 flex-1">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Calculation Formula</h4>
                <div className="p-3 bg-white border border-blue-200 rounded-md font-mono text-xs text-blue-800 inline-block">
                  Total Points = Base Rule Value × Tier Multiplier × Campaign Booster
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <h5 className="text-xs font-bold text-gray-700 uppercase mb-1">Example Scenario</h5>
                   <p className="text-sm text-gray-600">
                     A <span className="font-medium text-gray-900">Gold Member (1.5x)</span> makes a purchase during a <span className="font-medium text-gray-900">Double Points Campaign (2.0x)</span>.
                   </p>
                </div>
                <div>
                   <h5 className="text-xs font-bold text-gray-700 uppercase mb-1">Result</h5>
                   <p className="text-sm text-gray-600">
                     Base (10 pts) × 1.5 × 2.0 = <span className="font-bold text-green-600">30 Points Earned</span>
                   </p>
                </div>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
};