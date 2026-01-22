'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  X, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  RefreshCcw,
  MessageCircle,
  ShieldAlert,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Logo from '@/app/components/Logo';
import { getMyVendorApplicationAction } from '@/app/actions/vendor';
import { IVendorApplication } from '@/interfaces/vendor/vendor';
import { useToast } from '@/app/contexts/ToastContext';

const VendorSubscriptionFailedPage = () => {
  const searchParams = useSearchParams();
  const { showError } = useToast();
  
  const [vendorApplication, setVendorApplication] = useState<IVendorApplication | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);
  
  // Get error details from URL params
  const errorReason = searchParams.get('reason') || 'payment_failed';
  const subscriptionPlanId = searchParams.get('planId');
  const subscriptionPlanName = searchParams.get('planName') || 'Subscription Plan';

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

  const getErrorMessage = () => {
    if (errorReason === 'cancelled') {
      return "You have cancelled the payment process. No funds have been deducted from your account.";
    } else if (errorReason === 'insufficient_funds') {
      return "Your payment could not be processed due to insufficient funds. Please check your account balance and try again.";
    } else if (errorReason === 'card_declined') {
      return "Your card was declined. Please verify your card details or try a different payment method.";
    } else {
      return "We couldn't process your payment. This might be due to insufficient funds, a bank timeout, or incorrect payment details.";
    }
  };

  return (
    <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-4xl overflow-hidden shadow-2xl border border-jozi-forest/5 relative">
          
          <div className="p-8 md:p-12">
            {/* Header with Logo */}
            <div className="flex justify-center mb-8">
              <Logo className="h-16 w-auto" />
            </div>

            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <X className="w-10 h-10 text-red-500" strokeWidth={3} />
            </div>

            {/* Headlines */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-black text-jozi-forest tracking-tight mb-4">
                Payment Failed
              </h1>
              <p className="text-gray-500 font-medium text-lg mb-2">
                {getErrorMessage()}
              </p>
              <p className="text-gray-400 font-medium text-sm">
                Don't worry, your vendor application is still valid. You can try again anytime.
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

              {/* Right: Error Details & Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Reassurance Box */}
                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start text-left gap-4">
                  <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-2">Don't Worry</p>
                    <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                      Your vendor application is still approved and valid. No subscription has been activated, and you haven't been charged for this transaction.
                    </p>
                  </div>
                </div>

                {/* Subscription Plan Info */}
                {subscriptionPlanName && (
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest mb-4 border-l-4 border-jozi-gold pl-3">
                      Selected Plan
                    </h3>
                    <div className="space-y-2">
                      <p className="text-lg font-black text-jozi-forest">{subscriptionPlanName}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        You can retry subscribing to this plan or choose a different one.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Details */}
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                  <h3 className="text-xs font-black text-red-700 uppercase tracking-widest mb-4 border-l-4 border-red-500 pl-3">
                    Error Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Reason</span>
                      <span className="text-sm font-black text-red-700 capitalize">
                        {errorReason.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <X className="w-3 h-3" />
                        Failed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Date</span>
                      <span className="text-sm font-bold text-red-700">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <Link 
                href="/vendor/subscription" 
                className="flex items-center justify-center w-full bg-jozi-forest text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl hover:bg-jozi-gold hover:text-jozi-forest transition-all shadow-lg group"
              >
                <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Payment Again</span>
              </Link>
              
              <div className="flex gap-3">
                <Link 
                  href="/vendor/dashboard" 
                  className="flex-1 bg-white border border-gray-200 text-jozi-forest font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/support" 
                  className="flex-1 bg-white border border-gray-200 text-jozi-forest font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer Support Bar */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span className="text-xs font-bold">Having trouble with payment?</span>
              <Link href="/support" className="flex items-center text-xs font-black text-jozi-forest hover:underline">
                <MessageCircle className="w-3 h-3 mr-1" />
                Chat with Support
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSubscriptionFailedPage;
