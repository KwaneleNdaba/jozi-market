'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Loader2, 
  AlertCircle,
  X,
  Gift,
  CheckCircle,
  Edit2,
  Save
} from 'lucide-react';
import { 
  getAllTiersAction,
  getAllBenefitsAction,
  createBenefitAction,
  updateBenefitAction,
  deleteBenefitAction,
  activateBenefitAction,
  deactivateBenefitAction,
  getTierBenefitsByTierIdAction,
  createTierBenefitAction,
  deleteTierBenefitAction,
  activateTierBenefitAction,
  deactivateTierBenefitAction
} from '@/app/actions/points';
import type { ITier, IBenefit, ICreateBenefit, ITierBenefit, ICreateTierBenefit } from '@/interfaces/points/points';

// --- Internal Sub-components ---

// 1. Two-step Delete Button
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

// 2. Create/Edit Benefit Form
const BenefitForm = ({ 
  benefit, 
  onSave, 
  onCancel 
}: { 
  benefit?: IBenefit; 
  onSave: (data: ICreateBenefit) => Promise<void>; 
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ICreateBenefit>({
    name: benefit?.name || '',
    description: benefit?.description || '',
    active: benefit?.active ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Benefit Name *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="E.g., Priority Support, Free Shipping, Early Access"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this benefit"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--jozi-forest)] focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Toggle
            checked={formData.active ?? true}
            onChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <span className="text-sm text-gray-700">Active</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!formData.name.trim() || saving}
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {benefit ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};

// --- Main Component ---

export const TiersAndBenefitsTab: React.FC = () => {
  const [tiers, setTiers] = useState<ITier[]>([]);
  const [benefits, setBenefits] = useState<IBenefit[]>([]);
  const [tierBenefits, setTierBenefits] = useState<ITierBenefit[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<IBenefit | undefined>();
  const [deletingBenefitId, setDeletingBenefitId] = useState<string | null>(null);
  const [togglingBenefitId, setTogglingBenefitId] = useState<string | null>(null);
  const [linkingBenefitId, setLinkingBenefitId] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tiersRes, benefitsRes] = await Promise.all([
        getAllTiersAction(),
        getAllBenefitsAction()
      ]);

      if (tiersRes.error) throw new Error(tiersRes.message);
      if (benefitsRes.error) throw new Error(benefitsRes.message);

      setTiers(tiersRes.data || []);
      setBenefits(benefitsRes.data || []);

      // Select first tier by default
      if (tiersRes.data && tiersRes.data.length > 0) {
        setSelectedTierId(tiersRes.data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Load tier benefits when tier is selected
  useEffect(() => {
    if (selectedTierId) {
      loadTierBenefits(selectedTierId);
    }
  }, [selectedTierId]);

  const loadTierBenefits = async (tierId: string) => {
    try {
      const res = await getTierBenefitsByTierIdAction(tierId);
      if (res.error) throw new Error(res.message);
      setTierBenefits(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tier benefits');
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Benefit CRUD operations
  const handleCreateBenefit = async (data: ICreateBenefit) => {
    const res = await createBenefitAction(data);
    if (res.error) {
      setError(res.message);
      throw new Error(res.message);
    }
    
    setBenefits([...benefits, res.data]);
    setShowBenefitForm(false);
    showSuccess('Benefit created successfully');
  };

  const handleUpdateBenefit = async (data: ICreateBenefit) => {
    if (!editingBenefit) return;
    
    const res = await updateBenefitAction(editingBenefit.id, data);
    if (res.error) {
      setError(res.message);
      throw new Error(res.message);
    }
    
    setBenefits(benefits.map(b => b.id === editingBenefit.id ? res.data : b));
    setEditingBenefit(undefined);
    showSuccess('Benefit updated successfully');
  };

  const handleDeleteBenefit = async (id: string) => {
    setDeletingBenefitId(id);
    try {
      const res = await deleteBenefitAction(id);
      if (res.error) throw new Error(res.message);
      
      setBenefits(benefits.filter(b => b.id !== id));
      // Also remove any tier-benefit links
      setTierBenefits(tierBenefits.filter(tb => tb.benefitId !== id));
      showSuccess('Benefit deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete benefit');
    } finally {
      setDeletingBenefitId(null);
    }
  };

  const handleToggleBenefit = async (benefit: IBenefit) => {
    setTogglingBenefitId(benefit.id);
    try {
      const res = benefit.active 
        ? await deactivateBenefitAction(benefit.id)
        : await activateBenefitAction(benefit.id);
      
      if (res.error) throw new Error(res.message);
      
      setBenefits(benefits.map(b => b.id === benefit.id ? res.data : b));
      showSuccess(`Benefit ${benefit.active ? 'deactivated' : 'activated'} successfully`);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle benefit');
    } finally {
      setTogglingBenefitId(null);
    }
  };

  // Tier-Benefit linking operations
  const isBenefitLinked = (benefitId: string): boolean => {
    return tierBenefits.some(tb => tb.benefitId === benefitId);
  };

  const handleLinkBenefit = async (benefitId: string) => {
    if (!selectedTierId) return;
    
    setLinkingBenefitId(benefitId);
    try {
      // Check if already linked
      const existing = tierBenefits.find(tb => tb.benefitId === benefitId);
      
      if (existing) {
        // If inactive, activate it
        if (!existing.active) {
          const res = await activateTierBenefitAction(existing.id);
          if (res.error) throw new Error(res.message);
          setTierBenefits(tierBenefits.map(tb => tb.id === existing.id ? res.data : tb));
          showSuccess('Benefit linked successfully');
        } else {
          // If already active, deactivate it (unlink)
          const res = await deactivateTierBenefitAction(existing.id);
          if (res.error) throw new Error(res.message);
          setTierBenefits(tierBenefits.map(tb => tb.id === existing.id ? res.data : tb));
          showSuccess('Benefit unlinked successfully');
        }
      } else {
        // Create new link
        const data: ICreateTierBenefit = {
          tierId: selectedTierId,
          benefitId,
          active: true
        };
        
        const res = await createTierBenefitAction(data);
        if (res.error) throw new Error(res.message);
        
        setTierBenefits([...tierBenefits, res.data]);
        showSuccess('Benefit linked successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to link benefit');
    } finally {
      setLinkingBenefitId(null);
    }
  };

  const selectedTier = tiers.find(t => t.id === selectedTierId);
  const activeTierBenefits = tierBenefits.filter(tb => tb.active);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--jozi-forest)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Benefits Catalog Section */}
      <Card 
        title="Benefits Catalog" 
        subtitle="Manage all available benefits that can be assigned to tiers"
      >
        <div className="space-y-4">
          {/* Create Benefit Button */}
          {!showBenefitForm && !editingBenefit && (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowBenefitForm(true)}
            >
              Create New Benefit
            </Button>
          )}

          {/* Create Benefit Form */}
          {showBenefitForm && (
            <BenefitForm
              onSave={handleCreateBenefit}
              onCancel={() => setShowBenefitForm(false)}
            />
          )}

          {/* Edit Benefit Form */}
          {editingBenefit && (
            <BenefitForm
              benefit={editingBenefit}
              onSave={handleUpdateBenefit}
              onCancel={() => setEditingBenefit(undefined)}
            />
          )}

          {/* Benefits List */}
          {benefits.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">No benefits created yet</p>
              <p className="text-sm text-gray-500 mb-4">Create your first benefit to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    benefit.active 
                      ? 'bg-white border-gray-200 hover:border-gray-300' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{benefit.name}</h3>
                      {!benefit.active && (
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {benefit.description && (
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Toggle
                      checked={benefit.active}
                      onChange={() => handleToggleBenefit(benefit)}
                      disabled={togglingBenefitId === benefit.id}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 className="w-4 h-4" />}
                      onClick={() => setEditingBenefit(benefit)}
                      disabled={!benefit.active}
                    >
                      <span className="sr-only">Edit</span>
                    </Button>

                    <DeleteAction
                      onDelete={() => handleDeleteBenefit(benefit.id)}
                      loading={deletingBenefitId === benefit.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Tier Benefits Assignment Section */}
      {tiers.length > 0 && benefits.length > 0 && (
        <>
          {/* Tier Selector */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Select Tier to Manage Benefits
              </label>
              <div className="flex gap-3 flex-wrap">
                {tiers.filter(t => t.active).map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedTierId === tier.id
                        ? 'bg-[var(--jozi-forest)] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tier.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Tier Benefits */}
          {selectedTier && (
            <Card 
              title={`${selectedTier.name} Benefits`}
              subtitle={`${activeTierBenefits.length} benefit${activeTierBenefits.length !== 1 ? 's' : ''} assigned`}
            >
              <div className="space-y-2">
                {benefits.filter(b => b.active).map((benefit) => {
                  const tierBenefit = tierBenefits.find(tb => tb.benefitId === benefit.id);
                  const isLinked = tierBenefit?.active || false;
                  const isLinking = linkingBenefitId === benefit.id;

                  return (
                    <div
                      key={benefit.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        isLinked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isLinked}
                          onChange={() => handleLinkBenefit(benefit.id)}
                          disabled={isLinking}
                          className="w-4 h-4 text-[var(--jozi-forest)] border-gray-300 rounded focus:ring-[var(--jozi-forest)]"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{benefit.name}</h3>
                          {benefit.description && (
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                          )}
                        </div>
                      </div>

                      {isLinked && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      
                      {isLinking && (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      )}
                    </div>
                  );
                })}

                {benefits.filter(b => b.active).length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No active benefits available</p>
                    <p className="text-sm text-gray-500 mt-1">Create and activate benefits first</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {tiers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">No tiers available</p>
            <p className="text-sm text-gray-500">Create tiers first in the Tiers tab</p>
          </div>
        </Card>
      )}
    </div>
  );
};
