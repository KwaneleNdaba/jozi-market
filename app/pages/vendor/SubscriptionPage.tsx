'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Lock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Logo from '../../components/Logo';
import { 
  ISubscriptionPlan, 
  SubscriptionPlanStatus, 
  SubscriptionDuration,
  IFeature,
  ISubscriptionFeature,
  SubscriptionTransactionType
} from '@/interfaces/subscription/subscription';
import { 
  getAllSubscriptionPlansAction, 
  generateSubscriptionPaymentAction,
  getFeaturesBySubscriptionPlanIdAction
} from '@/app/actions/subscription';
import { getAllFeaturesAction } from '@/app/actions/feature';
import { getMyVendorApplicationAction } from '@/app/actions/vendor';
import { IVendorApplication } from '@/interfaces/vendor/vendor';
import { useToast } from '@/app/contexts/ToastContext';

interface PlanProps {
  plan: ISubscriptionPlan;
  features: IFeature[];
  includedFeatureIds: string[];
  allPlans: ISubscriptionPlan[];
  allFeatureMatrices: Record<string, string[]>;
  onSelect: (id: string) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const SubscriptionCard: React.FC<PlanProps> = ({ 
  plan, features, includedFeatureIds, allPlans, allFeatureMatrices, onSelect, isLoading, isDisabled = false
}) => {
  const priceDisplay = plan.price === 0 ? "Free" : `R${plan.price}`;
  const durationDisplay = plan.duration === SubscriptionDuration.MONTHLY ? 'mo' : 'yr';
  
  // Determine which plan is the base plan (Starter for Growth, Growth for Pro)
  const planName = plan.name.toLowerCase();
  const isGrowth = planName.includes('growth');
  const isPro = planName.includes('pro') || planName.includes('brand');
  
  // Get base plan features
  let basePlanFeatures: string[] = [];
  let basePlanFound = false;
  
  if (isGrowth) {
    // Growth includes Starter features
    const starterPlan = allPlans.find(p => {
      const pName = p.name.toLowerCase();
      return pName.includes('starter') || pName.includes('free');
    });
    if (starterPlan?.id) {
      basePlanFound = true;
      basePlanFeatures = allFeatureMatrices[starterPlan.id] || [];
    }
  } else if (isPro) {
    // Pro includes Growth features
    const growthPlan = allPlans.find(p => p.name.toLowerCase().includes('growth'));
    if (growthPlan?.id) {
      basePlanFound = true;
      basePlanFeatures = allFeatureMatrices[growthPlan.id] || [];
    }
  }
  
  // Get unique features for this plan (excluding base plan features)
  const uniqueFeatureIds = includedFeatureIds.filter(id => !basePlanFeatures.includes(id));
  
  // Get the features included in this plan, ensuring unique names
  const planFeatures = features
    .filter(f => uniqueFeatureIds.includes(f.id || ''))
    .filter((feature, index, self) => 
      index === self.findIndex(f => f.name === feature.name)
    );
  
  // Create display features array
  const displayFeatures: Array<{ name: string; isHeader?: boolean }> = [];
  
  // Add "Everything in X" header if applicable
  if (isGrowth && basePlanFound) {
    displayFeatures.push({ name: 'Everything in Starter', isHeader: true });
  } else if (isPro && basePlanFound) {
    displayFeatures.push({ name: 'Everything in Growth', isHeader: true });
  }
  
  // Add unique features
  planFeatures.forEach(f => {
    displayFeatures.push({ name: f.name, isHeader: false });
  });
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative bg-white rounded-5xl p-10 flex flex-col h-full border-2 transition-all ${
        plan.isStar ? 'border-jozi-gold shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-soft'
      }`}
    >
      {plan.isStar && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-jozi-gold text-jozi-dark text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
          Most Popular
        </div>
      )}

      <div className="mb-8 text-left">
        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">{plan.name}</h3>
        <p className="text-gray-400 text-xs font-medium mt-1">{plan.subtitle}</p>
      </div>

      <div className="mb-6 text-left">
        <div className="flex items-baseline space-x-1">
          {plan.price === 0 ? (
            <span className="text-5xl font-black text-jozi-dark">Free</span>
          ) : (
            <>
              <span className="text-5xl font-black text-jozi-dark">R{plan.price}</span>
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ {durationDisplay}</span>
            </>
          )}
        </div>
        <p className="text-gray-500 text-sm font-medium mt-4 leading-relaxed">{plan.description}</p>
      </div>

      {/* Features List */}
      {displayFeatures.length > 0 && (
        <div className="space-y-3 mb-8 grow">
          {displayFeatures.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-start space-x-3 text-left">
              {item.isHeader ? (
                <>
                  <div className="mt-1 w-5 h-5 rounded-full bg-jozi-gold/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-jozi-gold" />
                  </div>
                  <span className="text-sm font-bold text-jozi-forest leading-tight">{item.name}</span>
                </>
              ) : (
                <>
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 leading-tight">{item.name}</span>
                </>
              )}
            </div>
          ))}
          {displayFeatures.length > 6 && (
            <p className="text-xs text-gray-400 font-medium italic pl-8">
              + {displayFeatures.length - 6} more features
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => onSelect(plan.id!)}
        disabled={isLoading || plan.status !== SubscriptionPlanStatus.ACTIVE || isDisabled}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center group ${
          plan.isStar 
            ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark' 
            : 'bg-gray-50 text-jozi-forest hover:bg-jozi-cream'
        } ${plan.status !== SubscriptionPlanStatus.ACTIVE || isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Choose {plan.name}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </motion.div>
  );
};

const VendorSubscriptionPage: React.FC = () => {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [subscriptionFeatures, setSubscriptionFeatures] = useState<ISubscriptionFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorApplication, setVendorApplication] = useState<IVendorApplication | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);

  // Build matrix: which features are included in which plans
  const featureMatrix = useMemo(() => {
    const matrix: Record<string, string[]> = {};
    plans.forEach(plan => {
      if (plan.id) {
        const planFeatures = subscriptionFeatures
          .filter(sf => sf.subscriptionPlanId === plan.id && sf.isIncluded)
          .map(sf => sf.featureId);
        matrix[plan.id] = planFeatures;
      }
    });
    return matrix;
  }, [plans, subscriptionFeatures]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    fetchVendorApplication();
  }, []);

  const fetchVendorApplication = async () => {
    setLoadingVendor(true);
    try {
      const response = await getMyVendorApplicationAction();
      
      if (response.error) {
        showError(response.message || 'Failed to fetch vendor application');
        setVendorApplication(null);
      } else {
        setVendorApplication(response.data);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setVendorApplication(null);
    } finally {
      setLoadingVendor(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch plans and features in parallel
      const [plansResponse, featuresResponse] = await Promise.all([
        getAllSubscriptionPlansAction(SubscriptionPlanStatus.ACTIVE),
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

  // Format vendor information from application
  const formatDate = (date?: Date | string): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  const vendorInfo = useMemo(() => {
    if (!vendorApplication) {
      return null;
    }

    const businessAddress = vendorApplication.address 
      ? `${vendorApplication.address.street}, ${vendorApplication.address.city}, ${vendorApplication.address.postal}, ${vendorApplication.address.country}`
      : 'Address not provided';

    return {
      businessName: vendorApplication.shopName || vendorApplication.legalName || 'Unknown',
      applicantName: vendorApplication.contactPerson || 'Unknown',
      email: vendorApplication.email || '',
      phone: vendorApplication.phone || '',
      businessAddress,
      description: vendorApplication.description || '',
      dateApplied: formatDate(vendorApplication.submittedAt || vendorApplication.createdAt),
      status: vendorApplication.status,
    };
  }, [vendorApplication]);

  const handleSelectPlan = async (planId: string) => {
    if (!vendorApplication || !vendorInfo) {
      showError('Vendor application information is required');
      return;
    }

    setLoadingPlan(planId);
    try {
      // Generate payment URL
      const paymentResponse = await generateSubscriptionPaymentAction({
        subscriptionPlanId: planId,
        email: vendorInfo.email,
        fullName: vendorInfo.applicantName,
        phone: vendorInfo.phone,
        transactionType: SubscriptionTransactionType.NEW,
      });

      if (paymentResponse.error || !paymentResponse.data) {
        showError(paymentResponse.message || 'Failed to generate payment URL');
        setLoadingPlan(null);
        return;
      }

      // Redirect to payment URL
      if (paymentResponse.data.paymentUrl) {
        showSuccess('Redirecting to payment gateway...');
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        showError('Payment URL not received');
        setLoadingPlan(null);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-jozi-cream flex flex-col items-center py-16 px-4">
      {/* Locked Header */}
      <header className="mb-16 flex flex-col items-center space-y-8 max-w-3xl text-center">
        <Logo className="h-20 w-auto mb-4" />
        
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Approved Artisan</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
            Activate <br /><span className="text-jozi-gold">Your Store.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Your application has been approved. Choose a plan below to initialize your workshop and start reaching customers across South Africa.
          </p>
        </div>
      </header>

      {/* Main Content: Vendor Info Left, Plans Right */}
      <section className="container max-w-7xl mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 items-start">
          {/* Left: Vendor Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-5xl p-8 lg:p-12 shadow-lg border border-gray-100"
          >
            {loadingVendor ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Loading vendor information...</p>
              </div>
            ) : !vendorInfo ? (
              <div className="flex flex-col items-center justify-center py-24">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold">No vendor application found</p>
                <p className="text-gray-300 text-sm font-medium mt-2">Please submit a vendor application first</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-6 mb-12 pb-8 border-b border-gray-100">
                  <div className="w-20 h-20 bg-jozi-gold text-jozi-dark rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shadow-jozi-gold/20 uppercase">
                    {vendorInfo.businessName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase mb-2">{vendorInfo.businessName}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Registered {vendorInfo.dateApplied}</span>
                      </div>
                      {vendorInfo.status === 'approved' && (
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold uppercase tracking-widest text-[10px] text-emerald-600">Application Approved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Business Profile */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Business Profile</h3>
                    <p className="text-gray-600 font-medium leading-relaxed italic">"{vendorInfo.description}"</p>
                  </div>

                  {/* Contact Logic */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Contact Logic</h3>
                    <div className="space-y-4 bg-gray-50 p-6 rounded-3xl">
                      <div className="flex items-center space-x-4">
                        <Building2 className="w-5 h-5 text-jozi-gold" />
                        <span className="text-sm font-bold text-jozi-dark">{vendorInfo.applicantName}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="w-5 h-5 text-jozi-gold" />
                        <span className="text-sm font-bold text-jozi-dark">{vendorInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Phone className="w-5 h-5 text-jozi-gold" />
                        <span className="text-sm font-bold text-jozi-dark">{vendorInfo.phone}</span>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-5 h-5 text-jozi-gold mt-1" />
                        <span className="text-sm font-bold text-jozi-dark leading-relaxed">{vendorInfo.businessAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Right: Subscription Plans */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Loading subscription plans...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold">No subscription plans available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {plans.map(plan => {
                  const planId = plan.id || '';
                  const includedFeatureIds = featureMatrix[planId] || [];
                  const isDisabled = !vendorApplication || !vendorInfo;
                  return (
                    <SubscriptionCard
                      key={plan.id}
                      plan={plan}
                      features={features}
                      includedFeatureIds={includedFeatureIds}
                      allPlans={plans}
                      allFeatureMatrices={featureMatrix}
                      onSelect={handleSelectPlan}
                      isLoading={loadingPlan === plan.id}
                      isDisabled={isDisabled}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Feature Comparison Table */}
        {!loading && plans.length > 0 && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-white rounded-5xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-8 lg:p-12 border-b border-gray-100">
              <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase mb-2">
                Feature Comparison
              </h2>
              <p className="text-gray-500 font-medium">
                Compare what's included in each subscription plan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 sticky left-0 z-10 bg-gray-50/50 w-[300px] border-r border-gray-100">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Platform Features</p>
                    </th>
                    {plans.map(plan => (
                      <th key={plan.id} className="px-8 py-6 text-center border-b border-gray-100 min-w-[180px]">
                        <p className="text-xs font-black text-jozi-forest uppercase tracking-tight mb-1">{plan.name}</p>
                        <p className="text-[10px] font-bold text-jozi-gold">
                          {plan.price === 0 ? 'Free' : `R${plan.price}/${plan.duration === SubscriptionDuration.MONTHLY ? 'mo' : 'yr'}`}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {features
                    .filter((feature, index, self) => 
                      index === self.findIndex(f => f.name === feature.name)
                    )
                    .map(feature => (
                    <tr key={feature.id} className="hover:bg-jozi-cream/20 transition-colors">
                      <td className="px-8 py-6 sticky left-0 z-10 bg-white border-r border-gray-100 shadow-xl shadow-black/2">
                        <div className="space-y-1">
                          <p className="font-black text-jozi-dark text-sm leading-tight">{feature.name}</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{feature.description}</p>
                        </div>
                      </td>
                      {plans.map(plan => {
                        const planId = plan.id || '';
                        const featureId = feature.id || '';
                        const isIncluded = featureMatrix[planId]?.includes(featureId) || false;
                        
                        return (
                          <td key={planId} className="px-8 py-6 text-center">
                            {isIncluded ? (
                              <div className="flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                  <Check className="w-5 h-5 text-emerald-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <X className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </section>

      {/* Locked Footer */}
      <footer className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-gray-400">
           <Lock className="w-3.5 h-3.5" />
           <p className="text-[10px] font-black uppercase tracking-widest">
             Your store will go live immediately after payment verification.
           </p>
        </div>
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">
          Proudly South African Marketplace 🇿🇦
        </p>
      </footer>
    </div>
  );
};

export default VendorSubscriptionPage;
