
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  History,
  Info,
  Layers,
  ArrowLeft,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Vendor, Feature } from '../../types';

// Placeholder Data for Features
const FEATURES: Feature[] = [
  { id: 'f1', name: 'Standard Listings', description: 'List up to 50 products on the marketplace.', category: 'Sales', minTier: 'Free' },
  { id: 'f2', name: 'Vendor Analytics', description: 'View basic sales and traffic reports.', category: 'AI & Analytics', minTier: 'Free' },
  { id: 'f3', name: 'Custom Vouchers', description: 'Create discount codes for your customers.', category: 'Marketing', minTier: 'Starter' },
  { id: 'f4', name: 'Featured Store Placement', description: 'Appear on the category landing pages.', category: 'Marketing', minTier: 'Growth' },
  { id: 'f5', name: 'AI Product Descriptions', description: 'Generate professional copy using Gemini 3 Flash.', category: 'AI & Analytics', minTier: 'Growth', isNew: true },
  { id: 'f6', name: 'Priority Hub Dispatch', description: 'Faster processing at the Jozi Logistics Hub.', category: 'Logistics', minTier: 'Growth' },
  { id: 'f7', name: 'Homepage Spotlight', description: 'Rotating feature slot on the main Jozi Market homepage.', category: 'Marketing', minTier: 'Pro' },
  { id: 'f8', name: 'Smart Inventory AI', description: 'Predictive stock alerts based on seasonal trends.', category: 'AI & Analytics', minTier: 'Pro', isNew: true },
  { id: 'f9', name: 'Dedicated Brand Manager', description: '1-on-1 growth strategy sessions with our team.', category: 'Sales', minTier: 'Pro' },
];

// Placeholder Data for Vendors
const VENDORS: Vendor[] = [
  { id: 'v1', name: 'Maboneng Textiles', planTier: 'Pro', subscriptionFee: 1499, commissionRate: 3, rating: 4.8, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100', location: 'Maboneng', description: 'Artisan Textiles' },
  { id: 'v2', name: 'Soweto Gold Jewelry', planTier: 'Growth', subscriptionFee: 699, commissionRate: 5, rating: 4.9, image: 'https://images.unsplash.com/photo-1610492317734-d0370bcc645b?auto=format&fit=crop&q=80&w=100', location: 'Soweto', description: 'Premium Jewelry' },
  { id: 'v3', name: 'Rosebank Art Gallery', planTier: 'Starter', subscriptionFee: 299, commissionRate: 7, rating: 4.7, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=100', location: 'Rosebank', description: 'Local Fine Art' },
];

const TIER_ORDER: Vendor['planTier'][] = ['Free', 'Starter', 'Growth', 'Pro'];

const AdminVendorFeaturesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(VENDORS[0]);
  const [selectedTier, setSelectedTier] = useState<Vendor['planTier']>(VENDORS[0].planTier);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync selected tier when vendor changes
  useEffect(() => {
    setSelectedTier(selectedVendor.planTier);
    setOverrides({});
  }, [selectedVendor.id]);

  const filteredVendors = VENDORS.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFeatureIncluded = (feature: Feature, tier: Vendor['planTier']) => {
    return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(feature.minTier);
  };

  const getFeatureStatus = (feature: Feature) => {
    const defaultEnabled = isFeatureIncluded(feature, selectedTier);
    const hasOverride = overrides[feature.id] !== undefined;
    const currentEnabled = hasOverride ? overrides[feature.id] : defaultEnabled;

    return {
      isEnabled: currentEnabled,
      isOverridden: hasOverride,
      isDefault: defaultEnabled
    };
  };

  const handleToggleFeature = (featureId: string) => {
    const feature = FEATURES.find(f => f.id === featureId);
    if (!feature) return;

    const defaultState = isFeatureIncluded(feature, selectedTier);
    const currentState = overrides[featureId] !== undefined ? overrides[featureId] : defaultState;
    const newState = !currentState;

    // If toggling back to what the plan suggests, remove the override
    if (newState === defaultState) {
      const newOverrides = { ...overrides };
      delete newOverrides[featureId];
      setOverrides(newOverrides);
    } else {
      setOverrides({ ...overrides, [featureId]: newState });
    }
  };

  const hasChanges = useMemo(() => {
    return selectedTier !== selectedVendor.planTier || Object.keys(overrides).length > 0;
  }, [selectedTier, selectedVendor.planTier, overrides]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert(`Successfully saved ${selectedVendor.name}. 
Plan updated to: ${selectedTier}
Active Overrides: ${Object.keys(overrides).length}`);
    }, 1000);
  };

  const resetAll = () => {
    setSelectedTier(selectedVendor.planTier);
    setOverrides({});
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <section className="bg-jozi-dark pt-12 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">
                Artisan <br /><span className="text-jozi-gold">Configurations.</span>
              </h1>
            </div>

            {/* Searchable Selector */}
            <div className="relative w-full max-w-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 ml-1 text-right md:text-left">Selected Artisan Profile</p>
              <div 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:bg-white/15 transition-all"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
                    <img src={selectedVendor.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black text-sm">{selectedVendor.name}</p>
                    <p className="text-[10px] font-bold text-jozi-gold uppercase tracking-widest leading-none mt-1">Official Plan: {selectedVendor.planTier}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-jozi-gold transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                  >
                    <div className="p-4 border-b border-gray-50">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search artisans..." 
                          className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredVendors.map((v) => (
                        <div 
                          key={v.id}
                          className="flex items-center space-x-4 p-4 hover:bg-jozi-cream/30 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setSelectedVendor(v);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <img src={v.image} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-jozi-dark text-sm">{v.name}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{v.planTier} Tier</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Plan Management Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-gray-100 space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-jozi-dark">Subscription Management</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">Update the artisan's base tier to automatically adjust their platform feature set.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Active Plan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {TIER_ORDER.map(tier => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                          selectedTier === tier 
                            ? 'bg-jozi-forest border-jozi-forest text-white shadow-lg' 
                            : 'bg-white border-gray-50 text-gray-400 hover:border-jozi-gold/20'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-jozi-cream/30 rounded-3xl border border-jozi-forest/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Projected Comm.</p>
                    <p className="text-2xl font-black text-jozi-forest">
                      {selectedTier === 'Pro' ? '3%' : selectedTier === 'Growth' ? '5%' : selectedTier === 'Starter' ? '7%' : '10%'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${selectedTier === selectedVendor.planTier ? 'bg-jozi-forest' : 'bg-jozi-gold'} rounded-2xl flex items-center justify-center text-white shadow-xl transition-colors`}>
                    {selectedTier === selectedVendor.planTier ? <Layers className="w-6 h-6" /> : <RefreshCw className="w-6 h-6 animate-spin-slow" />}
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-jozi-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest transition-all flex items-center justify-center group">
                <History className="w-4 h-4 mr-2 text-jozi-gold" />
                View Billing History
              </button>
            </div>

            <div className="bg-jozi-forest p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
              <Sparkles className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
              <h4 className="text-xl font-black">Plan Insights</h4>
              <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium">Upgrading to the <span className="text-jozi-gold font-bold">Pro Tier</span> would reduce their commission by 40% and unlock dedicated account management.</p>
              <button className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-jozi-dark transition-all">
                Send Upgrade Offer
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-jozi-dark tracking-tight">Feature Matrix</h2>
                  <p className="text-gray-400 font-medium text-sm">Fine-tune individual features or override plan defaults.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={resetAll}
                    title="Reset to current actual plan"
                    className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                      hasChanges
                        ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark' 
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Apply Config'}</span>
                  </button>
                </div>
              </div>

              {/* Feature Categories */}
              {['Sales', 'Marketing', 'Logistics', 'AI & Analytics'].map(cat => {
                const catFeatures = FEATURES.filter(f => f.category === cat);
                if (catFeatures.length === 0) return null;

                return (
                  <div key={cat} className="mb-12 last:mb-0">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold mb-6 border-l-4 border-jozi-gold pl-4">{cat}</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {catFeatures.map(feature => {
                        const status = getFeatureStatus(feature);
                        return (
                          <div 
                            key={feature.id}
                            className={`p-6 rounded-3xl border-2 transition-all relative ${
                              status.isEnabled 
                                ? 'bg-white border-jozi-forest/10 hover:border-jozi-forest/30 shadow-sm' 
                                : 'bg-gray-50/50 border-transparent opacity-60'
                            }`}
                          >
                            {feature.isNew && (
                              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">New</span>
                            )}
                            
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1 pr-2">
                                <h5 className="font-black text-jozi-dark text-sm leading-tight">{feature.name}</h5>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                    status.isDefault ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {status.isDefault ? 'Included' : 'Excluded'}
                                  </span>
                                  {status.isOverridden && (
                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider bg-jozi-gold text-jozi-dark flex items-center">
                                      <Zap className="w-2 h-2 mr-1 fill-current" /> Override
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => handleToggleFeature(feature.id)}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none shrink-0 ${
                                  status.isEnabled ? 'bg-jozi-forest' : 'bg-gray-200'
                                }`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                  status.isEnabled ? 'translate-x-6' : 'translate-x-1'
                                } shadow-sm`} />
                              </button>
                            </div>
                            
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start space-x-6">
                <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-black text-amber-900 text-sm">Policy Confirmation</h4>
                  <p className="text-xs text-amber-800 font-medium leading-relaxed opacity-80">
                    Applying these changes will immediately impact the vendor's dashboard experience. Any subscription fee adjustments will be prorated and reflected on the next billing statement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminVendorFeaturesPage;
