'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Calendar, 
  Zap, 
  Share2, 
  MapPin,
  Download,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Logo from '@/app/components/Logo';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import { IUser } from '@/interfaces/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';

const CustomerCheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const { showError } = useToast();
  
  const [customer, setCustomer] = useState<IUser | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  
  // Get order details from URL params
  const orderId = searchParams.get('orderId') || searchParams.get('order_number') || 'ORD-XXXX';
  const pointsEarned = parseInt(searchParams.get('points') || '0', 10);
  const transactionId = searchParams.get('transactionId') || 'N/A';
  const totalAmount = searchParams.get('totalAmount');
  const estimatedDelivery = searchParams.get('estimatedDelivery');

  const customerInfo = useMemo(() => {
    if (!customer) {
      return null;
    }

    return {
      fullName: customer.fullName || 'Customer',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || 'Address not provided',
    };
  }, [customer]);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoadingCustomer(true);
      try {
        const response = await getCurrentUserAction();
        
        if (response.error) {
          showError(response.message || 'Failed to fetch customer information');
          setCustomer(null);
        } else {
          setCustomer(response.data);
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setCustomer(null);
      } finally {
        setLoadingCustomer(false);
      }
    };

    fetchCustomer();
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
          <div className="h-2 bg-linear-to-r from-jozi-forest via-jozi-gold to-jozi-forest" />
          
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
                Order Confirmed!
              </h1>
              <p className="text-gray-500 font-medium text-lg mb-2">
                Thank you for supporting local artisans.
              </p>
              <p className="text-gray-400 font-medium text-sm">
                We've sent a receipt to your email. Your order is being prepared.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Customer Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-3xl p-6 lg:p-8 border border-gray-100"
              >
                {loadingCustomer ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-jozi-gold animate-spin mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Loading customer information...</p>
                  </div>
                ) : !customerInfo ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Customer information not available</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="w-16 h-16 bg-jozi-gold text-jozi-dark rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-jozi-gold/20 uppercase shrink-0">
                        {customerInfo.fullName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-black text-jozi-forest tracking-tight uppercase mb-1 truncate">
                          {customerInfo.fullName}
                        </h2>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span className="font-bold uppercase tracking-widest">Jozi Member</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-3">
                          Contact Information
                        </h3>
                        <div className="space-y-3 bg-white p-4 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark truncate">{customerInfo.fullName}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark truncate">{customerInfo.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-jozi-gold shrink-0" />
                            <span className="text-sm font-bold text-jozi-dark">{customerInfo.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-jozi-gold shrink-0 mt-1" />
                            <span className="text-sm font-bold text-jozi-dark leading-relaxed">{customerInfo.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Right: Order Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Loyalty Reward Card */}
                {pointsEarned > 0 && (
                  <div className="bg-linear-to-br from-jozi-forest to-gray-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-jozi-gold/20 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-jozi-gold" />
                        <span className="text-xs font-bold uppercase tracking-widest text-jozi-gold">Rewards Earned</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-black">+{pointsEarned} Pts</p>
                          <p className="text-xs text-gray-300 mt-1">Keep shopping to earn more rewards!</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                          <Zap className="w-6 h-6 text-jozi-gold" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest mb-4 border-l-4 border-jozi-gold pl-3">
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                      <span className="text-sm font-black text-jozi-forest font-mono">{orderId}</span>
                    </div>
                    {totalAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-sm font-black text-jozi-forest">R{parseFloat(totalAmount).toFixed(2)}</span>
                      </div>
                    )}
                    {estimatedDelivery && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Delivery</span>
                        <span className="text-sm font-bold text-jozi-forest">
                          {new Date(estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <Check className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>
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
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Order Confirmed</p>
                    <p className="text-xs text-emerald-800/80 font-medium">
                      Your order has been received and is being processed. You'll receive updates via email.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <Link 
                href="/orders" 
                className="flex items-center justify-center w-full bg-jozi-forest text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl hover:bg-jozi-gold hover:text-jozi-forest transition-all shadow-lg group"
              >
                <span>Track My Order</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex gap-3">
                <Link 
                  href="/shop" 
                  className="flex-1 bg-white border border-gray-200 text-jozi-forest font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  Continue Shopping
                </Link>
                <Link 
                  href="/orders" 
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
            Need help with this order? Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerCheckoutSuccessPage;