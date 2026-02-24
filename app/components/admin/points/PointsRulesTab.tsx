'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Toggle } from './Toggle';
import { Input } from './Input';
import { Button } from './Button';
import { Modal } from './Modal';
import { HelpTooltip } from './Tooltip';
import { AlertCircle, Info, Save, Loader2 } from 'lucide-react';
import type { PointsConfig } from './mockData';
import { 
  getAllPointsConfigsAction, 
  createPointsConfigAction,
  updatePointsConfigAction,
  activatePointsConfigAction,
  deactivatePointsConfigAction
} from '@/app/actions/points';
import type { IPointsConfig } from '@/interfaces/points/points';

interface PointsRulesTabProps {
  config: PointsConfig;
  configId?: string;
  onChange: (config: PointsConfig) => void;
  onRequestConfirmation: (action: 'disable-points-system' | 'change-conversion-rate' | 'change-tier-multiplier', callback: () => void) => void;
}

export const PointsRulesTab: React.FC<PointsRulesTabProps> = ({ 
  config,
  configId,
  onChange,
  onRequestConfirmation 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [existingConfig, setExistingConfig] = useState<IPointsConfig | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch existing configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const response = await getAllPointsConfigsAction();
        
        if (!response.error && response.data && response.data.length > 0) {
          // There should only be one config
          const backendConfig = response.data[0];
          setExistingConfig(backendConfig);
          setIsCreatingNew(false);
          
          // Map backend config to frontend format
          const mappedConfig: PointsConfig = {
            enabled: backendConfig.pointsEnabled,
            allowRedemption: backendConfig.redemptionEnabled,
            allowStacking: backendConfig.allowStackWithDiscounts,
            isActive: backendConfig.isActive,
            version: backendConfig.version,
          };
          
          onChange(mappedConfig);
        } else {
          // No config exists, user can create new
          setIsCreatingNew(true);
          setExistingConfig(null);
        }
      } catch (error) {
        console.error('[PointsRulesTab] Error fetching config:', error);
        setSaveError('Failed to load existing configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleToggleEnabled = (checked: boolean) => {
    if (!checked) {
      onRequestConfirmation('disable-points-system', () => {
        onChange({ ...config, enabled: checked });
      });
    } else {
      onChange({ ...config, enabled: checked });
    }
  };

  const handleActivateToggle = async (shouldActivate: boolean) => {
    if (!existingConfig) {
      setSaveError('Please save the configuration first before activating');
      return;
    }

    setSaving(true);
    setSaveError(null);
    
    try {
      const response = shouldActivate 
        ? await activatePointsConfigAction(existingConfig.id)
        : await deactivatePointsConfigAction(existingConfig.id);

      if (response.error) {
        setSaveError(response.message);
      } else if (response.data) {
        setExistingConfig(response.data);
        onChange({ ...config, isActive: response.data.isActive, version: response.data.version });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('[PointsRulesTab] Error toggling activation:', error);
      setSaveError('Failed to update activation status');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Prepare data in backend format
      const backendData = {
        pointsEnabled: config.enabled,
        redemptionEnabled: config.allowRedemption,
        allowStackWithDiscounts: config.allowStacking,
        createdBy: 'Current Admin User', // TODO: Get from auth context
      };

      let response;
      
      if (isCreatingNew || !existingConfig) {
        // Create new configuration
        response = await createPointsConfigAction(backendData);
        
        if (!response.error && response.data) {
          setExistingConfig(response.data);
          setIsCreatingNew(false);
        }
      } else {
        // Update existing configuration
        response = await updatePointsConfigAction(existingConfig.id, backendData);
        
        if (!response.error && response.data) {
          setExistingConfig(response.data);
        }
      }

      if (response.error) {
        setSaveError(response.message);
      } else {
        setSaveSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('[PointsRulesTab] Error saving config:', error);
      setSaveError('An unexpected error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while fetching config
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Loading configuration...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Status & Version */}
      {existingConfig && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Status</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Version {config.version} | Last updated: {new Date(existingConfig.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                config.isActive 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {config.isActive ? '● Active' : '○ Inactive'}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <Toggle
                checked={config.isActive}
                onChange={handleActivateToggle}
                label="Activate Configuration"
                description={config.isActive 
                  ? "This configuration is currently live and affecting all customers" 
                  : "Activate this configuration to make it live for all customers"}
                disabled={saving || !existingConfig}
              />
              
              {config.isActive && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                  <Info className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Configuration is Live</p>
                    <p className="text-xs text-green-700 mt-1">
                      Activated on: {existingConfig.activatedAt ? new Date(existingConfig.activatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* System Status */}
      <Card title="Points System Status" subtitle="Enable or disable the entire points system">
        <div className="space-y-4">
          <Toggle
            checked={config.enabled}
            onChange={handleToggleEnabled}
            label="Enable Points System"
            description="Customers can earn and redeem points across the marketplace"
          />
          
          {!config.enabled && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Points System Disabled</p>
                <p className="text-xs text-amber-700 mt-1">
                  Customers cannot earn or redeem points. Existing points balances are preserved.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Redemption & Stacking */}
      <Card title="Redemption Rules" subtitle="Control how customers can use their points">
        <div className="space-y-4">
          <Toggle
            checked={config.allowRedemption}
            onChange={(checked) => onChange({ ...config, allowRedemption: checked })}
            label="Allow Points Redemption"
            description="Customers can redeem points for discounts at checkout"
            disabled={!config.enabled}
          />
          
          <div className="border-t border-gray-200 pt-4">
            <Toggle
              checked={config.allowStacking}
              onChange={(checked) => onChange({ ...config, allowStacking: checked })}
              label="Allow Points Stacking with Discounts"
              description="Customers can use points alongside promo codes or vouchers"
              disabled={!config.enabled || !config.allowRedemption}
            />
          </div>

          {config.allowStacking && config.allowRedemption && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-rose-900">Revenue Impact Warning</p>
                <p className="text-xs text-rose-700 mt-1">
                  Enabling stacking may significantly reduce revenue per transaction. Monitor closely.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Guidance Card */}
      <Card>
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Points Value Guidance</p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>Recommended: R1 = 1 point (1% cashback equivalent)</li>
              <li>Aggressive: R1 = 2+ points (2%+ cashback, higher liability)</li>
              <li>Conservative: R2 = 1 point (0.5% cashback, lower engagement)</li>
              <li>Consider your average order value and profit margins</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Save Section */}
      <div className="space-y-3">
        {/* Info about create vs update */}
        {isCreatingNew && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Creating New Configuration</p>
              <p className="text-xs text-blue-700 mt-1">
                This will create the first points configuration for your marketplace. There can only be one active configuration.
              </p>
            </div>
          </div>
        )}

        {!isCreatingNew && existingConfig && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Updating Existing Configuration</p>
              <p className="text-xs text-amber-700 mt-1">
                Last updated: {new Date(existingConfig.updatedAt).toLocaleString()} | Version: {existingConfig.version}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Failed to save configuration</p>
              <p className="text-xs text-red-700 mt-1">{saveError}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                {isCreatingNew ? 'Configuration created successfully!' : 'Configuration updated successfully!'}
              </p>
              <p className="text-xs text-green-700 mt-1">Your points rules have been saved.</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={handleSaveClick}
            disabled={saving}
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : (isCreatingNew ? 'Create Configuration' : 'Update Configuration')}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={isCreatingNew ? 'Create Points Configuration?' : 'Update Points Configuration?'}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                {isCreatingNew ? 'You are about to create a new points configuration' : 'You are about to update the points configuration'}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {isCreatingNew 
                  ? 'This will establish the foundational rules for your points system. You can activate it later.'
                  : 'This will update the existing configuration. If the configuration is active, changes will affect all customers immediately.'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Configuration Summary:</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Points System:</span>
                <span className="font-medium text-gray-900">{config.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Redemption:</span>
                <span className="font-medium text-gray-900">{config.allowRedemption ? 'Allowed' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stacking with Discounts:</span>
                <span className="font-medium text-gray-900">{config.allowStacking ? 'Allowed' : 'Not Allowed'}</span>
              </div>
              {!isCreatingNew && existingConfig && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">{config.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium text-gray-900">{config.version}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmSave}
              disabled={saving}
              icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? 'Saving...' : (isCreatingNew ? 'Yes, Create Configuration' : 'Yes, Update Configuration')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
