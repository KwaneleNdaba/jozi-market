'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Logo from '@/app/components/Logo';
import { getMyVendorApplicationAction } from '@/app/actions/vendor';
import { IVendorApplication } from '@/interfaces/vendor/vendor';
import { useToast } from '@/app/contexts/ToastContext';

const VendorSubscriptionSuccessPage = () => {
  const searchParams = useSearchParams();
  const { showError } = useToast();
  
  const [vendorApplication, setVendorApplication] = useState<IVendorApplication | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);
  
  // Get subscription details from URL params
  const subscriptionPlanId = searchParams.get('planId');
  const subscriptionPlanName = searchParams.get('planName') || 'Subscription Plan';
  const transactionId = searchParams.get('transactionId') || 'N/A';
  const nextBillingDate = searchParams.get('nextBillingDate');

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

  useEffect(() => {
    const fetchVendorApplication = async () => {
      setLoadingVendor(true);
      try {
        const response = await getMyVendorApplicationAction();
        
        if (response.error) {
          showError(response.message || 'Failed to fetch vendor information');
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

    fetchVendorApplication();
  }, [showError]);

  return (
    <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-4xl overflow-hidden shadow-2xl border border-jozi-forest/5 relative">
          
          {/* Top Decoration */}
          <div className="h-2 bg-gradient-to-r from-jozi-forest via-jozi-gold to-jozi-forest" />
          
          <div className="p-8 md:p-12">
            {/* Header with Logo */}
            <div className="flex justify-center mb-8">
              <Logo className="h-16 w-auto" />
            </div>

            {/* Success Icon Animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping opacity-75" />
              <Check className="w-10 h-10 text-emerald-600 relative z-10" strokeWidth={4} />
            </motion.div>

            {/* Headlines */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-black text-jozi-forest tracking-tight mb-4">
                Welcome to the Club!
              </h1>
              <p className="text-gray-500 font-medium text-lg mb-2">
                Your vendor subscription is now active.
              </p>
              <p className="text-gray-400 font-medium text-sm">
                You're ready to start selling to customers across South Africa.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Vendor Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-3xl p-6 lg:p-8 border border-gray-100"
              >
                {loadingVendor ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-jozi-gold animate-spin mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Loading vendor information...</p>
                  </div>
                ) : !vendorInfo ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Vendor information not available</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="w-16 h-16 bg-jozi-gold text-jozi-dark rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-jozi-gold/20 uppercase shrink-0">
                        {vendorInfo.businessName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-black text-jozi-forest tracking-tight uppercase mb-1 truncate">
                          {vendorInfo.businessName}
                        </h2>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span className="font-bold uppercase tracking-widest">Registered {vendorInfo.dateApplied}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Business Profile */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-3">
                          Business Profile
                        </h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed italic">
                          "{vendorInfo.description}"
                        </p>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-3">
                          Contact Logic
                        </h3>
                        <div className="space-y-3 bg-white p-4 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <Building2 className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark truncate">{vendorInfo.applicantName}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark truncate">{vendorInfo.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark">{vendorInfo.phone}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-jozi-gold shrink-0 mt-1" />
                            <span className="text-sm font-bold text-jozi-dark leading-relaxed">{vendorInfo.businessAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Right: Subscription Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Subscription Success Card */}
                <div className="bg-gradient-to-br from-jozi-forest to-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-jozi-gold/20 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-jozi-gold" />
                      <span className="text-xs font-bold uppercase tracking-widest text-jozi-gold">Active Subscription</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2">{subscriptionPlanName}</h3>
                    <p className="text-sm text-gray-300 mb-6">Your subscription is now active and ready to use.</p>
                    
                    {nextBillingDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Next billing: {new Date(nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest mb-4 border-l-4 border-jozi-gold pl-3">
                    Transaction Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction ID</span>
                      <span className="text-sm font-black text-jozi-forest font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <Check className="w-3 h-3" />
                        Paid
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</span>
                      <span className="text-sm font-bold text-jozi-forest">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Verified & Active</p>
                    <p className="text-xs text-emerald-800/80 font-medium">
                      Your vendor account is fully verified and ready to start selling.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <Link 
                href="/vendor/dashboard" 
                className="flex items-center justify-center w-full bg-jozi-forest text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl hover:bg-jozi-gold hover:text-jozi-forest transition-all shadow-lg group"
              >
                <span>Go to Vendor Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex gap-3">
                <Link 
                  href="/vendor/inventory" 
                  className="flex-1 bg-white border border-gray-200 text-jozi-forest font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  Manage Inventory
                </Link>
                <Link 
                  href="/vendor/orders" 
                  className="flex-1 bg-white border border-gray-200 text-jozi-forest font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <Link href="/support" className="text-xs font-bold text-gray-400 hover:text-jozi-forest transition-colors">
            Need help? Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSubscriptionSuccessPage;
