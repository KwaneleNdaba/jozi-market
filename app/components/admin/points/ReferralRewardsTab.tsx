'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { HelpTooltip } from './Tooltip';
import { 
  Gift, Users, TrendingUp, Award, Shield, Save, 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, Upload, FileText
} from 'lucide-react';
import {
  IReferralRewardConfig,
  ICreateReferralRewardConfig,
  IReferralSlotReward,
  ICreateReferralSlotReward,
} from '../../../../interfaces/points/points';
import { FILE_API } from '../../../../endpoints/rest-api/file/file';
import {
  getAllReferralRewardConfigsAction,
  createReferralRewardConfigAction,
  updateReferralRewardConfigAction,
  deleteReferralRewardConfigAction,
  enableReferralRewardConfigAction,
  disableReferralRewardConfigAction,
  getReferralSlotRewardsByConfigIdAction,
  createReferralSlotRewardAction,
  updateReferralSlotRewardAction,
  deleteReferralSlotRewardAction,
  activateReferralSlotRewardAction,
  deactivateReferralSlotRewardAction,
} from '../../../actions/points';

interface ReferralRewardsTabProps {}

export const ReferralRewardsTab: React.FC<ReferralRewardsTabProps> = () => {
  const [configs, setConfigs] = useState<IReferralRewardConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<IReferralRewardConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ICreateReferralRewardConfig>({
    enabled: true,
    signupPoints: 0,
    firstPurchasePoints: 0,
    minPurchaseAmount: 0,
    oneRewardPerReferredUser: true,
    startDate: null,
    endDate: null,
  });

  const [slotRewards, setSlotRewards] = useState<IReferralSlotReward[]>([]);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<IReferralSlotReward | null>(null);
  const [slotFormData, setSlotFormData] = useState<Partial<ICreateReferralSlotReward>>({
    slotNumber: 1,
    title: '',
    description: '',
    quantity: 1,
    valuePoints: 0,
    active: true,
  });
  const [slotFile, setSlotFile] = useState<File | null>(null);
  const [isUploadingSlotFile, setIsUploadingSlotFile] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await getAllReferralRewardConfigsAction();
      if (!response.error && response.data) {
        setConfigs(response.data);
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlotRewards = async (configId: string) => {
    try {
      const response = await getReferralSlotRewardsByConfigIdAction(configId);
      if (!response.error && response.data) {
        setSlotRewards(response.data);
      }
    } catch (error) {
      console.error('Error loading slot rewards:', error);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedConfig(null);
    setFormData({
      enabled: true,
      signupPoints: 0,
      firstPurchasePoints: 0,
      minPurchaseAmount: 0,
      oneRewardPerReferredUser: true,
      startDate: null,
      endDate: null,
    });
    setSlotRewards([]);
  };

  const handleEdit = (config: IReferralRewardConfig) => {
    setSelectedConfig(config);
    setIsCreating(false);
    setFormData({
      enabled: config.enabled,
      signupPoints: config.signupPoints,
      firstPurchasePoints: config.firstPurchasePoints,
      minPurchaseAmount: config.minPurchaseAmount,
      oneRewardPerReferredUser: config.oneRewardPerReferredUser,
      startDate: config.startDate,
      endDate: config.endDate,
    });
    loadSlotRewards(config.id);
  };

  const handleBack = () => {
    setSelectedConfig(null);
    setIsCreating(false);
    setSlotRewards([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        const response = await createReferralRewardConfigAction(formData);
        if (!response.error && response.data) {
          alert('Referral configuration created successfully!');
          await loadConfigs();
          setIsCreating(false);
          setSelectedConfig(response.data);
          loadSlotRewards(response.data.id);
        } else {
          alert(response.message || 'Failed to create configuration');
        }
      } else if (selectedConfig) {
        const response = await updateReferralRewardConfigAction(selectedConfig.id, formData);
        if (!response.error && response.data) {
          alert('Referral configuration updated successfully!');
          await loadConfigs();
          setSelectedConfig(response.data);
        } else {
          alert(response.message || 'Failed to update configuration');
        }
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!configToDelete) return;
    
    try {
      const response = await deleteReferralRewardConfigAction(configToDelete);
      if (!response.error) {
        alert('Configuration deleted successfully!');
        await loadConfigs();
        if (selectedConfig?.id === configToDelete) {
          handleBack();
        }
      } else {
        alert(response.message || 'Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      alert('Failed to delete configuration');
    } finally {
      setShowDeleteModal(false);
      setConfigToDelete(null);
    }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const response = enabled 
        ? await enableReferralRewardConfigAction(id)
        : await disableReferralRewardConfigAction(id);
      
      if (!response.error) {
        await loadConfigs();
        if (selectedConfig?.id === id && response.data) {
          setSelectedConfig(response.data);
          setFormData(prev => ({ ...prev, enabled: response.data!.enabled }));
        }
      } else {
        alert(response.message || 'Failed to toggle configuration');
      }
    } catch (error) {
      console.error('Error toggling config:', error);
    }
  };

  const handleAddSlot = () => {
    setEditingSlot(null);
    setSlotFormData({
      slotNumber: slotRewards.length + 1,
      title: '',
      description: '',
      quantity: 1,
      valuePoints: 0,
      active: true,
    });
    setSlotFile(null);
    setShowSlotModal(true);
  };

  const handleEditSlot = (slot: IReferralSlotReward) => {
    setEditingSlot(slot);
    setSlotFormData({
      slotNumber: slot.slotNumber,
      title: slot.title,
      description: slot.description || '',
      fileUrl: slot.fileUrl || '',
      quantity: slot.quantity,
      valuePoints: slot.valuePoints,
      active: slot.active,
    });
    setSlotFile(null); // Reset file, user can upload new one if needed
    setShowSlotModal(true);
  };

  const handleSaveSlot = async () => {
    if (!selectedConfig) return;

    setIsUploadingSlotFile(true);

    try {
      // Upload file if new file is provided
      let fileUrl = slotFormData.fileUrl || '';
      
      if (slotFile) {
        const fileFormData = new FormData();
        fileFormData.append('files', slotFile);
        const fileResponse = await FILE_API.UPLOAD_FILE(fileFormData);
        
        if (fileResponse?.data && fileResponse.data.length > 0) {
          fileUrl = fileResponse.data[0].url;
        } else {
          setIsUploadingSlotFile(false);
          alert('Failed to upload file');
          return;
        }
      }

      setIsUploadingSlotFile(false);

      if (editingSlot) {
        const response = await updateReferralSlotRewardAction(editingSlot.id, {
          ...slotFormData,
          fileUrl: fileUrl || undefined,
        });
        if (!response.error) {
          await loadSlotRewards(selectedConfig.id);
          setShowSlotModal(false);
          setSlotFile(null);
        } else {
          alert(response.message || 'Failed to update slot reward');
        }
      } else {
        const response = await createReferralSlotRewardAction({
          rewardConfigId: selectedConfig.id,
          slotNumber: slotFormData.slotNumber!,
          title: slotFormData.title!,
          description: slotFormData.description,
          fileUrl: fileUrl || undefined,
          quantity: slotFormData.quantity!,
          valuePoints: slotFormData.valuePoints!,
          active: slotFormData.active,
        });
        if (!response.error) {
          await loadSlotRewards(selectedConfig.id);
          setShowSlotModal(false);
          setSlotFile(null);
        } else {
          alert(response.message || 'Failed to create slot reward');
        }
      }
    } catch (error) {
      console.error('Error saving slot:', error);
      setIsUploadingSlotFile(false);
      alert('Failed to save slot reward');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!selectedConfig || !confirm('Are you sure you want to delete this slot reward?')) return;

    try {
      const response = await deleteReferralSlotRewardAction(id);
      if (!response.error) {
        await loadSlotRewards(selectedConfig.id);
      } else {
        alert(response.message || 'Failed to delete slot reward');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Failed to delete slot reward');
    }
  };

  const handleToggleSlotActive = async (id: string, active: boolean) => {
    if (!selectedConfig) return;

    try {
      const response = active
        ? await activateReferralSlotRewardAction(id)
        : await deactivateReferralSlotRewardAction(id);
      
      if (!response.error) {
        await loadSlotRewards(selectedConfig.id);
      } else {
        alert(response.message || 'Failed to toggle slot reward');
      }
    } catch (error) {
      console.error('Error toggling slot:', error);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  if (!isCreating && !selectedConfig) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Referral Reward Configurations</h2>
            <p className="text-sm text-gray-600 mt-1">Manage referral programs and milestone rewards</p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateNew}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Configuration
          </Button>
        </div>

        {loading ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          </Card>
        ) : configs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Configurations Yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Create your first referral reward configuration to get started.
              </p>
              <Button
                variant="primary"
                onClick={handleCreateNew}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Configuration
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Signup Points</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purchase Points</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Min Purchase</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Range</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {configs.map((config) => (
                    <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Toggle checked={config.enabled} onChange={(checked) => handleToggleEnabled(config.id, checked)} />
                          <Badge variant={config.enabled ? 'success' : 'default'}>{config.enabled ? 'Active' : 'Inactive'}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{config.signupPoints} pts</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{config.firstPurchasePoints} pts</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-600">R{config.minPurchaseAmount}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{config.startDate ? formatDate(config.startDate) : 'Always'} - {config.endDate ? formatDate(config.endDate) : 'Forever'}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-600">{formatDate(config.createdAt)}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(config)} icon={<Edit2 className="w-4 h-4" />}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => { setConfigToDelete(config.id); setShowDeleteModal(true); }} icon={<Trash2 className="w-4 h-4" />} className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Configuration">
          <div className="space-y-4">
            <p className="text-gray-600">Are you sure you want to delete this referral configuration? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDelete} className="bg-red-600 hover:bg-red-700" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>Back to List</Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isCreating ? 'Create Referral Configuration' : 'Edit Referral Configuration'}</h2>
            <p className="text-sm text-gray-600 mt-1">{isCreating ? 'Set up a new referral rewards program' : 'Update referral rewards settings'}</p>
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={saving} icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>{saving ? 'Saving...' : 'Save Configuration'}</Button>
      </div>

      <Card><div className="p-6"><Toggle checked={formData.enabled || false} onChange={(checked) => setFormData({ ...formData, enabled: checked })} label="Enable Referral Program" description="Allow customers to refer friends and earn points" /></div></Card>

      {formData.enabled && (
        <>
          <Card title="Campaign Duration" subtitle="Optional date range for this referral program">
            <div className="grid grid-cols-2 gap-6">
              <Input label="Start Date" type="date" value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value) : null })} description="Leave empty for immediate start" />
              <Input label="End Date" type="date" value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value) : null })} description="Leave empty for no expiration" />
            </div>
          </Card>

          <Card title="Basic Referral Rewards" subtitle="Points awarded for referral milestones" actions={<HelpTooltip content="Rewards are given to the referrer, not the referred friend" />}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
                  <div className="flex-1"><Input label="Signup Reward" type="number" min="0" value={formData.signupPoints || 0} onChange={(e) => setFormData({ ...formData, signupPoints: parseInt(e.target.value) || 0 })} suffix="points" description="Points when referred friend signs up" /></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
                  <div className="flex-1"><Input label="First Purchase Reward" type="number" min="0" value={formData.firstPurchasePoints || 0} onChange={(e) => setFormData({ ...formData, firstPurchasePoints: parseInt(e.target.value) || 0 })} suffix="points" description="Points when friend makes first purchase" /></div>
                </div>
              </div>
              <Input label="Minimum Purchase Threshold" type="number" min="0" value={formData.minPurchaseAmount || 0} onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseInt(e.target.value) || 0 })} prefix="R" description="Friend's first purchase must exceed this amount to trigger reward" className="max-w-xs" />
            </div>
          </Card>

          {!isCreating && selectedConfig && (
            <Card title="Milestone Bonus Rewards (Gamification)" subtitle="Progressive rewards for referring multiple friends" actions={<Button variant="primary" size="sm" onClick={handleAddSlot} icon={<Plus className="w-4 h-4" />}>Add Milestone</Button>}>
              {slotRewards.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">No milestone rewards configured yet</p>
                  <Button variant="secondary" size="sm" onClick={handleAddSlot} icon={<Plus className="w-4 h-4" />}>Add First Milestone</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {slotRewards.sort((a, b) => a.slotNumber - b.slotNumber).map((slot) => (
                    <div key={slot.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-50 rounded-lg shrink-0">
                          {slot.fileUrl ? (
                            <img src={slot.fileUrl} alt={slot.title} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <Award className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Slot {slot.slotNumber}: {slot.title}</h4>
                              <p className="text-sm text-gray-600">{slot.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Toggle checked={slot.active} onChange={(checked) => handleToggleSlotActive(slot.id, checked)} />
                              <Badge variant={slot.active ? 'success' : 'default'}>{slot.active ? 'Active' : 'Inactive'}</Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 px-3 py-2 rounded"><p className="text-xs text-gray-600">Slot Number</p><p className="text-sm font-semibold text-gray-900">{slot.slotNumber}</p></div>
                            <div className="bg-gray-50 px-3 py-2 rounded"><p className="text-xs text-gray-600">Quantity</p><p className="text-sm font-semibold text-gray-900">{slot.quantity}</p></div>
                            <div className="bg-gray-50 px-3 py-2 rounded"><p className="text-xs text-gray-600">Bonus Points</p><p className="text-sm font-semibold text-gray-900">{slot.valuePoints} pts</p></div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSlot(slot)} icon={<Edit2 className="w-3 h-3" />}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteSlot(slot.id)} icon={<Trash2 className="w-3 h-3" />} className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card title="Anti-Abuse Protection" subtitle="Prevent referral fraud and abuse" actions={<HelpTooltip content="Additional guardrails are configured in the Guardrails tab" />}>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div><Toggle checked={formData.oneRewardPerReferredUser || false} onChange={(checked) => setFormData({ ...formData, oneRewardPerReferredUser: checked })} label="One Reward Per Referred User" description="Each email/phone can only be referred once across all referrers (strongly recommended)" /></div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">Additional Protections</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maximum referrals per week limit (configured in Guardrails)</li>
                      <li>• Device and IP address tracking (configured in Guardrails)</li>
                      <li>• Auto-flagging for suspicious patterns (configured in Guardrails)</li>
                      <li>• Referred users must make qualifying purchase above minimum threshold</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      <Modal isOpen={showSlotModal} onClose={() => setShowSlotModal(false)} title={editingSlot ? 'Edit Milestone Reward' : 'Add Milestone Reward'}>
        <div className="space-y-4">
          <Input label="Slot Number" type="number" min="1" value={slotFormData.slotNumber || 1} onChange={(e) => setSlotFormData({ ...slotFormData, slotNumber: parseInt(e.target.value) || 1 })} description="Position in the milestone sequence" />
          <Input label="Title" type="text" value={slotFormData.title || ''} onChange={(e) => setSlotFormData({ ...slotFormData, title: e.target.value })} placeholder="e.g., Bronze Referrer" required />
          <Input label="Description" type="text" value={slotFormData.description || ''} onChange={(e) => setSlotFormData({ ...slotFormData, description: e.target.value })} placeholder="e.g., Awarded when referrer reaches 3 successful referrals" />
          
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reward Image/Badge (Optional)
            </label>
            <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
              slotFile || slotFormData.fileUrl 
                ? 'border-emerald-500/30 bg-emerald-50/10' 
                : 'border-gray-200 bg-gray-50 hover:border-blue-300'
            }`}>
              {!slotFile && !slotFormData.fileUrl ? (
                <>
                  <div className="flex flex-col items-center justify-center text-center py-4">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold text-gray-700">Upload Image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert('File size must be less than 2MB');
                          return;
                        }
                        setSlotFile(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-gray-200">
                      {slotFile ? (
                        slotFile.type.includes('image') ? (
                          <img src={URL.createObjectURL(slotFile)} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-600" />
                        )
                      ) : slotFormData.fileUrl ? (
                        <img src={slotFormData.fileUrl} className="w-full h-full object-cover rounded-lg" alt="Current" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {slotFile ? slotFile.name : 'Current image'}
                      </p>
                      {slotFile && (
                        <p className="text-xs text-gray-500">
                          {(slotFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSlotFile(null);
                      if (!editingSlot) {
                        setSlotFormData({ ...slotFormData, fileUrl: undefined });
                      }
                    }} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              This image will be displayed as a badge/icon for this milestone reward
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" min="1" value={slotFormData.quantity || 1} onChange={(e) => setSlotFormData({ ...slotFormData, quantity: parseInt(e.target.value) || 1 })} description="Number of referrals required" />
            <Input label="Bonus Points" type="number" min="0" value={slotFormData.valuePoints || 0} onChange={(e) => setSlotFormData({ ...slotFormData, valuePoints: parseInt(e.target.value) || 0 })} description="One-time bonus award" />
          </div>
          <div className="flex items-center gap-2"><Toggle checked={slotFormData.active || false} onChange={(checked) => setSlotFormData({ ...slotFormData, active: checked })} label="Active" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowSlotModal(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleSaveSlot} 
              disabled={isUploadingSlotFile}
              icon={isUploadingSlotFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isUploadingSlotFile ? 'Uploading...' : 'Save Milestone'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};