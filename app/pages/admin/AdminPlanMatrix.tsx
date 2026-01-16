
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, HelpCircle, Check, X, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ISubscriptionPlan } from '@/interfaces/subscription/subscription';
import { IFeature } from '@/interfaces/subscription/subscription';
import { ISubscriptionFeature, ICreateSubscriptionFeature, IUpdateSubscriptionFeature } from '@/interfaces/subscription/subscription';
import { getAllSubscriptionPlansAction } from '@/app/actions/subscription';
import { getAllFeaturesAction } from '@/app/actions/feature';
import { 
  getFeaturesBySubscriptionPlanIdAction,
  createSubscriptionFeatureAction,
  updateSubscriptionFeatureAction,
  deleteSubscriptionFeatureAction
} from '@/app/actions/subscription';
import { useToast } from '@/app/contexts/ToastContext';

const AdminPlanMatrix: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [subscriptionFeatures, setSubscriptionFeatures] = useState<ISubscriptionFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingFeature, setUpdatingFeature] = useState<string | null>(null);

  // Build matrix from subscription features
  const matrix = useMemo(() => {
    const matrixData: Record<string, string[]> = {};
    
    plans.forEach(plan => {
      const planFeatures = subscriptionFeatures
        .filter(sf => sf.subscriptionPlanId === plan.id && sf.isIncluded)
        .map(sf => sf.featureId);
      matrixData[plan.id || ''] = planFeatures;
    });
    
    return matrixData;
  }, [plans, subscriptionFeatures]);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch plans and features in parallel
      const [plansResponse, featuresResponse] = await Promise.all([
        getAllSubscriptionPlansAction(),
        getAllFeaturesAction()
      ]);

      if (plansResponse.error || !plansResponse.data) {
        showError(plansResponse.message || 'Failed to fetch subscription plans');
        setPlans([]);
      } else {
        setPlans(plansResponse.data);
      }

      if (featuresResponse.error || !featuresResponse.data) {
        showError(featuresResponse.message || 'Failed to fetch features');
        setFeatures([]);
      } else {
        setFeatures(featuresResponse.data);
      }

      // Fetch subscription features for all plans
      if (plansResponse.data && plansResponse.data.length > 0) {
        await fetchSubscriptionFeatures(plansResponse.data);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionFeatures = async (plansData: ISubscriptionPlan[]) => {
    try {
      const allSubscriptionFeatures: ISubscriptionFeature[] = [];
      
      // Fetch features for each plan
      for (const plan of plansData) {
        if (plan.id) {
          const response = await getFeaturesBySubscriptionPlanIdAction(plan.id);
          if (!response.error && response.data) {
            allSubscriptionFeatures.push(...response.data);
          }
        }
      }
      
      setSubscriptionFeatures(allSubscriptionFeatures);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch subscription features');
    }
  };

  const updateMatrix = async (planId: string, featureId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || !plan.id) {
      showError('Plan not found');
      return;
    }

    const key = `${planId}-${featureId}`;
    setUpdatingFeature(key);

    try {
      // Check if subscription feature already exists
      const existingSubscriptionFeature = subscriptionFeatures.find(
        sf => sf.subscriptionPlanId === planId && sf.featureId === featureId
      );

      const isCurrentlyEnabled = existingSubscriptionFeature?.isIncluded || false;

      if (isCurrentlyEnabled && existingSubscriptionFeature) {
        // Disable: Update to isIncluded = false
        if (existingSubscriptionFeature.id) {
          const updateData: IUpdateSubscriptionFeature = {
            id: existingSubscriptionFeature.id,
            isIncluded: false
          };
          const response = await updateSubscriptionFeatureAction(updateData);
          
          if (response.error) {
            throw new Error(response.message || 'Failed to update subscription feature');
          }
          
          // Update local state
          setSubscriptionFeatures(prev => 
            prev.map(sf => sf.id === existingSubscriptionFeature.id 
              ? { ...sf, isIncluded: false }
              : sf
            )
          );
        }
      } else {
        // Enable: Create new or update existing to true
        if (existingSubscriptionFeature?.id) {
          // Update existing to true
          const updateData: IUpdateSubscriptionFeature = {
            id: existingSubscriptionFeature.id,
            isIncluded: true
          };
          const response = await updateSubscriptionFeatureAction(updateData);
          
          if (response.error) {
            throw new Error(response.message || 'Failed to update subscription feature');
          }
          
          // Update local state
          setSubscriptionFeatures(prev => 
            prev.map(sf => sf.id === existingSubscriptionFeature.id 
              ? { ...sf, isIncluded: true }
              : sf
            )
          );
        } else {
          // Create new
          const createData: ICreateSubscriptionFeature = {
            subscriptionPlanId: planId,
            featureId: featureId,
            isIncluded: true
          };
          const response = await createSubscriptionFeatureAction(createData);
          
          if (response.error || !response.data) {
            throw new Error(response.message || 'Failed to create subscription feature');
          }
          
          // Add to local state
          setSubscriptionFeatures(prev => [...prev, response.data!]);
        }
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update feature matrix');
    } finally {
      setUpdatingFeature(null);
    }
  };

  const handleSync = async () => {
    setIsSaving(true);
    try {
      // Refresh all data to ensure consistency
      await fetchAllData();
      showSuccess('Global configuration synchronized successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to synchronize');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <section className="bg-jozi-forest py-24 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-6">
            <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
            </Link>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
              Plan <br /><span className="text-jozi-gold">Architecture.</span>
            </h1>
            <p className="text-jozi-cream/70 text-xl font-medium max-w-xl italic leading-relaxed">
              Design the value proposition for each membership tier by mapping capabilities to price points.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-5xl border border-white/20 min-w-[280px] space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-60 font-bold uppercase tracking-widest">Active Plans</span>
              <span className="font-black text-jozi-gold">{plans.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-60 font-bold uppercase tracking-widest">Features</span>
              <span className="font-black text-jozi-gold">{features.length}</span>
            </div>
            <button 
              onClick={handleSync}
              disabled={isSaving || loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all ${isSaving || loading ? 'bg-white/20 text-white/50' : 'bg-jozi-gold text-jozi-dark hover:bg-white'}`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                'Deploy Matrix'
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-5xl shadow-soft border border-jozi-forest/5 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-400">
              <HelpCircle className="w-5 h-5 text-jozi-gold" />
              <p className="text-xs font-bold italic">Changes here immediately affect the vendor benefit dashboards.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
              <p className="text-gray-400 font-bold">Loading plan matrix...</p>
            </div>
          ) : plans.length === 0 || features.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold">
                {plans.length === 0 ? 'No subscription plans found' : 'No features found'}
              </p>
              <p className="text-xs text-gray-400 mt-2">Please create plans and features first</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-10 sticky left-0 z-10 bg-gray-50/50 w-[350px] border-r border-gray-100">
                      <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Platform Toolset</p>
                    </th>
                    {plans.map(plan => (
                      <th key={plan.id} className="px-10 py-10 text-center border-b border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tier</p>
                        <p className="text-3xl font-black text-jozi-forest">{plan.name}</p>
                        <p className="text-xs font-bold text-jozi-gold mt-1">R{plan.price}/{plan.duration === 'monthly' ? 'mo' : 'yr'}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {features.map(feat => (
                    <tr key={feat.id} className="hover:bg-jozi-cream/20 transition-colors">
                      <td className="px-10 py-8 sticky left-0 z-10 bg-white border-r border-gray-100 shadow-xl shadow-black/2">
                        <div className="space-y-1">
                          <p className="font-black text-jozi-dark text-sm leading-tight">{feat.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-2">{feat.description}</p>
                        </div>
                      </td>
                      {plans.map(plan => {
                        const planId = plan.id || '';
                        const featureId = feat.id || '';
                        const isEnabled = matrix[planId]?.includes(featureId) || false;
                        const updateKey = `${planId}-${featureId}`;
                        const isUpdating = updatingFeature === updateKey;
                        
                        return (
                          <td key={planId} className="px-10 py-8 text-center">
                            <button 
                              onClick={() => updateMatrix(planId, featureId)}
                              disabled={isUpdating}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-all ${
                                isEnabled 
                                  ? 'bg-jozi-forest text-white shadow-lg hover:bg-jozi-dark' 
                                  : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : isEnabled ? (
                                <Check className="w-6 h-6" />
                              ) : (
                                <X className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPlanMatrix;
