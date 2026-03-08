'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './Card';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Button } from './Button';
import { HelpTooltip } from './Tooltip';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  Star,
  Gift,
  ChevronDown, 
  ChevronUp, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Bell,
  Trash2
} from 'lucide-react';
import {
  getAllExpiryRulesAction,
  createExpiryRuleAction,
  updateExpiryRuleAction,
  deleteExpiryRuleAction,
  activateExpiryRuleAction,
  deactivateExpiryRuleAction
} from '@/app/actions/points';
import type { IExpiryRule, ICreateExpiryRule, ExpiryType } from '@/interfaces/points/points';


// --- Sub-components ---

const AutoSaveInput = ({ 
  value, 
  onSave, 
  type = "text", 
  min, 
  max,
  className, 
  suffix,
  disabled 
}: { 
  value: string | number; 
  onSave: (val: string | number) => void;
  type?: string;
  min?: string;
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

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'purchase': return <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="w-4 h-4 text-blue-600" /></div>;
    case 'referral': return <div className="p-2 bg-purple-100 rounded-lg"><Users className="w-4 h-4 text-purple-600" /></div>;
    case 'engagement': return <div className="p-2 bg-amber-100 rounded-lg"><Star className="w-4 h-4 text-amber-600" /></div>;
    case 'gift': return <div className="p-2 bg-green-100 rounded-lg"><Gift className="w-4 h-4 text-green-600" /></div>;
    default: return <div className="p-2 bg-gray-100 rounded-lg"><Clock className="w-4 h-4 text-gray-600" /></div>;
  }
};

// --- Main Component ---

export const ExpiryRulesTab: React.FC = () => {
  const [rules, setRules] = useState<IExpiryRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    try {
      const response = await getAllExpiryRulesAction();
      
      if (response.error) {
        setError(response.message);
      } else if (response.data) {
        setRules(response.data);
      }
    } catch (err) {
      console.error('[ExpiryRulesTab] Error loading expiry rules:', err);
      setError('Failed to load expiry rules');
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

  const handleUpdateRule = async (ruleId: string, updates: Partial<IExpiryRule>) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    setActionLoading(ruleId);
    
    try {
      const response = await updateExpiryRuleAction(ruleId, updates);
      
      if (response.error) {
        handleNotify('error', response.message);
        loadRules(); // Revert
      } else {
        handleNotify('success', 'Rule updated successfully');
      }
    } catch (err) {
      handleNotify('error', 'Update failed');
      loadRules(); // Revert
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateMissingRule = async (type: ExpiryType) => {
    setActionLoading('create');
    try {
      const newRule: ICreateExpiryRule = {
        expiryType: type,
        expiryDays: 365,
        active: true
      };
      
      const response = await createExpiryRuleAction(newRule);
      
      if (response.error) {
        handleNotify('error', response.message);
      } else if (response.data) {
        setRules(prev => [...prev, response.data!]);
        setExpandedRule(response.data.id);
        handleNotify('success', `${type} rule created successfully`);
      }
    } catch (err) {
      console.error('[ExpiryRulesTab] Error creating rule:', err);
      handleNotify('error', 'Failed to create rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (ruleId: string, isActive: boolean) => {
    setActionLoading(ruleId);
    
    try {
      const response = isActive 
        ? await deactivateExpiryRuleAction(ruleId)
        : await activateExpiryRuleAction(ruleId);
      
      if (response.error) {
        handleNotify('error', response.message);
      } else {
        handleNotify('success', `Rule ${isActive ? 'deactivated' : 'activated'} successfully`);
        await loadRules();
      }
    } catch (err) {
      console.error('[ExpiryRulesTab] Error toggling rule status:', err);
      handleNotify('error', 'Failed to toggle rule status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this expiry rule? This action cannot be undone.')) {
      return;
    }

    setActionLoading(ruleId);
    
    try {
      const response = await deleteExpiryRuleAction(ruleId);
      
      if (response.error) {
        handleNotify('error', response.message);
      } else {
        handleNotify('success', 'Rule deleted successfully');
        await loadRules();
      }
    } catch (err) {
      console.error('[ExpiryRulesTab] Error deleting rule:', err);
      handleNotify('error', 'Failed to delete rule');
    } finally {
      setActionLoading(null);
    }
  };

  // Identify which rules are missing from the DB
  const availableTypes = ['purchase', 'referral', 'engagement', 'gift'] as const;
  const missingTypes = availableTypes.filter(type => !rules.find(r => r.expiryType === type));

  // --- Render Helpers ---

  const columns = [
    {
      key: 'type',
      header: 'Source Type',
      width: '30%',
      render: (rule: IExpiryRule) => (
        <div className="flex items-center gap-3">
          <TypeIcon type={rule.expiryType} />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 capitalize">{rule.expiryType}</span>
            <span className="text-xs text-gray-500">
              Points from {rule.expiryType} activities
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Expiry Duration',
      width: '25%',
      render: (rule: IExpiryRule) => (
        <AutoSaveInput
          type="number"
          min="0"
          value={rule.expiryDays}
          onSave={(val) => handleUpdateRule(rule.id, { expiryDays: Number(val) })}
          suffix="days"
          className="w-32"
          disabled={!rule.active}
        />
      ),
    },
    {
      key: 'description',
      header: 'How It Works',
      width: '30%',
      render: (rule: IExpiryRule) => (
        <div className="text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> 
            Expires {rule.expiryDays} days after points are earned
          </span>
        </div>
      ),
    },
    {
      key: 'active',
      header: 'Active',
      width: '10%',
      render: (rule: IExpiryRule) => (
        <Toggle
          checked={rule.active}
          onChange={() => handleToggleActive(rule.id, rule.active)}
          disabled={actionLoading === rule.id}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '5%',
      render: (rule: IExpiryRule) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
          className={`transition-transform duration-200 ${expandedRule === rule.id ? 'bg-gray-100' : ''}`}
          icon={expandedRule === rule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        >
          <span className="sr-only">Toggle details</span>
        </Button>
      ),
    },
  ];

  // Helper for preview section
  const getRuleByType = (type: string) => rules.find(r => r.expiryType === type && r.active);

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
        <>
          {/* Missing Rules Prompt */}
          {missingTypes.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-blue-900">
                  <span className="font-semibold">Unconfigured Point Sources:</span> Some point types do not have expiry rules yet.
                </div>
              </div>
              <div className="flex gap-2">
                {missingTypes.map(type => (
                  <Button
                    key={type}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCreateMissingRule(type)}
                    disabled={actionLoading === 'create'}
                    className="capitalize text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    + Add {type} Rule
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Card 
            title="Expiry Rules" 
            subtitle="Configure validity periods for different point sources"
          >
            <div className="min-w-full">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[30%_25%_30%_10%_5%] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Source Type</div>
                  <div>Expiry Duration</div>
                  <div>How It Works</div>
                  <div>Status</div>
                  <div className="text-right">Details</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {rules.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No active expiry rules found. Add a rule above to get started.
                    </div>
                  ) : (
                    rules.map((rule) => (
                      <div key={rule.id} className="group bg-white transition-colors hover:bg-gray-50/50">
                        {/* Main Row */}
                        <div className="grid grid-cols-[30%_25%_30%_10%_5%] gap-4 px-6 py-4 items-center">
                          {columns.map((col, idx) => (
                            <div key={`${rule.id}-${idx}`} className="flex items-center">
                              {col.render(rule)}
                            </div>
                          ))}
                        </div>

                        {/* Expandable Configuration */}
                        {expandedRule === rule.id && (
                          <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="p-5 bg-gray-50 border border-gray-100 rounded-lg shadow-inner">
                              
                              <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  Expiry Rule Details
                                </h4>
                                
                                <div className="space-y-3 pl-6">
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500 mb-1">Points Validity Period</p>
                                      <AutoSaveInput
                                        type="number"
                                        min="1"
                                        value={rule.expiryDays}
                                        onSave={(val) => handleUpdateRule(rule.id, { expiryDays: Number(val) })}
                                        className="w-full"
                                        suffix="days"
                                        disabled={!rule.active}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                                    <p className="text-xs text-blue-900">
                                      <strong>How it works:</strong> Points earned from {rule.expiryType} activities will automatically expire {rule.expiryDays} days after they are earned. 
                                      Customers will see these points removed from their balance when they expire.
                                    </p>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                                disabled={actionLoading === rule.id}
                                icon={<Trash2 className="w-4 h-4 text-red-600" />}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Delete Rule
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Dynamic Preview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2" title="Customer Timeline Preview" subtitle="How expiry applies to a sample customer today">
              <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mb-2">NOW</div>
                  <div className="w-0.5 h-full bg-gray-200 min-h-[100px]"></div>
                </div>
                <div className="flex-1 space-y-4 pt-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer earns points today</p>
                    <p className="text-xs text-gray-500">Total +550 pts across different activities</p>
                  </div>
                  
                  <div className="space-y-3 bg-white p-4 rounded border border-gray-100 shadow-sm">
                    {/* Purchase Preview */}
                    {getRuleByType('purchase') ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <ShoppingCart className="w-3.5 h-3.5 text-blue-500" /> 
                          250 Purchase Pts
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                          Expires in {getRuleByType('purchase')?.expiryDays} days
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-6">Purchase rules not active</div>
                    )}

                    {/* Referral Preview */}
                    {getRuleByType('referral') ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <Users className="w-3.5 h-3.5 text-purple-500" /> 
                          150 Referral Pts
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                           Expires in {getRuleByType('referral')?.expiryDays} days
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-6">Referral rules not active</div>
                    )}

                     {/* Engagement Preview */}
                     {getRuleByType('engagement') ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <Star className="w-3.5 h-3.5 text-amber-500" /> 
                          100 Review Pts
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                           Expires in {getRuleByType('engagement')?.expiryDays} days
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-6">Engagement rules not active</div>
                    )}

                     {/* Gift Preview */}
                     {getRuleByType('gift') ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <Gift className="w-3.5 h-3.5 text-green-500" /> 
                          50 Gifted Pts
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                           Expires in {getRuleByType('gift')?.expiryDays} days
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-6">Gift rules not active</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Strategy Tips">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-amber-400 rounded-full shrink-0 min-h-[40px]"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">Short Expiry (30-90d)</p>
                    <p className="text-xs text-gray-600">Reduces liability quickly but may frustrate casual customers who don't shop frequently.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-blue-400 rounded-full shrink-0 min-h-[40px]"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">Standard (180-365d)</p>
                    <p className="text-xs text-gray-600">Industry standard. Gives customers enough time to accumulate and redeem points.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-green-400 rounded-full shrink-0 min-h-[40px]"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">Different Durations</p>
                    <p className="text-xs text-gray-600">Consider longer expiry for high-value activities (purchases) and shorter for low-value (engagement).</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};