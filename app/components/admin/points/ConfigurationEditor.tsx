'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Stepper } from './Stepper';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import { Modal } from './Modal';
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PointsRulesTab } from './PointsRulesTab';
import { TiersTab } from './TiersTab';
import { TiersAndBenefitsTab } from './TiersAndBenefitsTab';
import { ReferralRewardsTab } from './ReferralRewardsTab';
import { ExpiryRulesTab } from './ExpiryRulesTab';
import { PreviewActivateTab } from './PreviewActivateTab';
import type {
  PointsConfig,
  Tier,
  EarningRule,
  ExpiryRule,
  ReferralConfig,
  CampaignConfig
} from './mockData';
import { 
  initialPointsConfig, 
  initialTiers,
  initialEarningRules,
  initialExpiryRules,
  initialReferralConfig,
  initialCampaignConfig
} from './mockData';
import {
  createPointsConfigAction,
} from '@/app/actions/points';
import { EarningRulesTab } from './EarningRulesTab';

interface ConfigurationEditorProps {
  configId?: string;
}

interface ConfigState {
  id: string;
  version: number;
  status: 'active' | 'draft' | 'archived';
  createdBy: string;
  createdAt: string;
  pointsConfig: PointsConfig;
  tiers: Tier[];
  earningRules: EarningRule[];
  campaignConfig: CampaignConfig;
  expiryRules: ExpiryRule;
  referralConfig: ReferralConfig;
}

const steps = [
  { id: 'points', label: 'Points Rules', description: 'Configure point earning and redemption' },
  { id: 'tiers', label: 'Tiers', description: 'Set up loyalty tiers' },
  { id: 'tier-benefits', label: 'Tiers & Benefits', description: 'Manage tier benefits' },
  { id: 'earning', label: 'Earning Rules', description: 'Define how points are earned' },
  { id: 'referral', label: 'Referral & Rewards', description: 'Configure referral program' },
  { id: 'expiry', label: 'Expiry Rules', description: 'Set point expiration rules' },
];

const getInitialConfig = (configId: string | undefined): ConfigState => {
  if (!configId) {
    // Return default config if no ID provided
    return {
      id: 'new',
      version: 0,
      status: 'draft',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      pointsConfig: { ...initialPointsConfig },
      tiers: [...initialTiers],
      earningRules: [...initialEarningRules],
      campaignConfig: { ...initialCampaignConfig },
      expiryRules: { ...initialExpiryRules },
      referralConfig: { ...initialReferralConfig },
    };
  }

  const isNew = configId === 'new';
  const isActive = configId === 'config-1';
  const isDraft = configId === 'config-2';

  return {
    id: isNew ? 'new' : configId,
    version: isNew ? 0 : parseInt(configId.split('-')[1]) || 1,
    status: isActive ? 'active' : isDraft ? 'draft' : 'archived',
    createdBy: isNew ? 'Current User' : 'admin@jozi.com',
    createdAt: isNew ? new Date().toISOString() : '2024-01-15T10:30:00Z',
    pointsConfig: { ...initialPointsConfig },
    tiers: [...initialTiers],
    earningRules: [...initialEarningRules],
    campaignConfig: { ...initialCampaignConfig },
    expiryRules: { ...initialExpiryRules },
    referralConfig: { ...initialReferralConfig },
  };
};

export const ConfigurationEditor: React.FC<ConfigurationEditorProps> = ({ configId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode') || (configId === 'new' ? 'edit' : 'view');
  const isReadOnly = mode === 'view';
  const isNew = !configId || configId === 'new';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [savedConfigId, setSavedConfigId] = useState<string | undefined>(configId);
  const [loading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isActivating, setActivating] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load configuration
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      
      if (isNew) {
        // For new config, use initial mock data
        setConfig(getInitialConfig(configId));
        setLoading(false);
        return;
      }

      try {
        // For existing config, fetch from API
        // TODO: Implement get config by ID endpoint
        // For now, use mock data
        setConfig(getInitialConfig(configId));
        
        // You can fetch related data here when backend is ready:
        // const [tiersRes, earningRes, referralRes, guardrailsRes] = await Promise.all([
        //   getAllTiersAction(),
        //   getAllEarningRulesAction(),
        //   getReferralConfigAction(),
        //   getGuardrailsConfigAction(),
        // ]);
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadConfig();
  }, [configId, isNew]);

  const handleSaveDraft = async () => {
    if (!config) return;
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      if (!savedConfigId || savedConfigId === 'new') {
        // Create new configuration (only on first step)
        const response = await createPointsConfigAction({
          pointsEnabled: config.pointsConfig.enabled,
          redemptionEnabled: config.pointsConfig.allowRedemption,
          allowStackWithDiscounts: config.pointsConfig.allowStacking,
          createdBy: 'Current Admin User', // TODO: Get from auth context
        });

        if (!response.error && response.data) {
          setSavedConfigId(response.data.id);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setSaveError(response.message);
        }
      } else {
        // Configuration already created, just show success
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step
    setCurrentStep(stepIndex);
  };

  const handleActivate = () => {
    setShowActivateModal(true);
  };

  const confirmActivate = async () => {
    if (!config) return;
    
    setActivating(true);
    try {
      // TODO: Implement activate configuration endpoint
      // For now, just show success message
      setTimeout(() => {
        setActivating(false);
        setShowActivateModal(false);
        alert('Configuration activated successfully!');
        router.push('/admin/points-config');
      }, 1000);
    } catch (error) {
      console.error('Error activating configuration:', error);
      alert('Failed to activate configuration');
      setActivating(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/points-config');
  };

  const handleConfirmation = (action: string, callback: () => void) => {
    if (confirm(`Are you sure you want to ${action}?`)) {
      callback();
    }
  };

  const renderStepContent = () => {
    const effectiveConfigId = savedConfigId !== 'new' ? savedConfigId : undefined;

    switch (currentStep) {
      case 0: // Points Rules
        return (
          <PointsRulesTab
            config={config!.pointsConfig}
            configId={effectiveConfigId}
            onChange={(pointsConfig) => setConfig({ ...config!, pointsConfig })}
            onRequestConfirmation={handleConfirmation}
          />
        );
      
      case 1: // Tiers
        return (
          <TiersTab />
        );
      
      case 2: // Tiers & Benefits
        return (
          <TiersAndBenefitsTab />
        );
      
      case 3: // Earning Rules
        return (
          <EarningRulesTab
            campaignConfig={config!.campaignConfig}
            onCampaignConfigChange={(campaignConfig: CampaignConfig) => setConfig({ ...config!, campaignConfig })}
          />
        );
      
      case 4: // Referral & Rewards
        return (
          <ReferralRewardsTab
          />
        );
      
      case 5: // Expiry Rules
        return (
          <ExpiryRulesTab
          />
        );
      
      case 6: // Review & Save
        return (
          <PreviewActivateTab
            onActivate={handleActivate}
            isActivating={isActivating}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration Not Found</h3>
          <p className="text-gray-600 mb-4">The requested configuration could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
     

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Create New Configuration' : `Configuration Version ${config.version}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isReadOnly ? 'View-only mode' : isNew ? 'Create a new points configuration' : 'Edit configuration'}
            </p>
          </div>
          {!isNew && (
            <Badge
              variant={
                config.status === 'active' ? 'success' :
                config.status === 'draft' ? 'warning' :
                'default'
              }
            >
              {config.status === 'active' && <CheckCircle2 className="w-4 h-4 mr-1" />}
              {config.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">Configuration saved successfully!</p>
            <p className="text-xs text-green-700 mt-1">You can now proceed to the next step.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Failed to save configuration</p>
            <p className="text-xs text-red-700 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {/* Stepper */}
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <Card className="mt-6 p-6">
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSaveDraft}
              icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          )}
        </div>
      </div>

      {/* Activation Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        title="Activate Configuration"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to activate this configuration? This will deactivate any currently active configuration.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowActivateModal(false)}
              disabled={isActivating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmActivate}
              disabled={isActivating}
              icon={isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {isActivating ? 'Activating...' : 'Activate'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
