'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  X, 
  AlertCircle, 
  ArrowRight, 
  RefreshCcw, 
  MessageCircle,
  ShieldAlert
} from 'lucide-react';

const FailedPage = () => {
  const searchParams = useSearchParams();
  // Get error reason from URL params, default to 'payment_failed'
  const errorReason = (searchParams.get('reason') as 'payment_failed' | 'cancelled') || 'payment_failed';

  return (
    <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-4xl overflow-hidden shadow-2xl border border-jozi-forest/5 relative">
          
          <div className="p-8 md:p-12 text-center">
            
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <X className="w-10 h-10 text-red-500" strokeWidth={3} />
            </div>

            {/* Headlines */}
            <h1 className="text-3xl font-black text-jozi-forest tracking-tight mb-3">
              {errorReason === 'cancelled' ? 'Order Cancelled' : 'Payment Failed'}
            </h1>
            
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 px-4">
              {errorReason === 'cancelled' 
                ? "You have cancelled the checkout process. No funds have been deducted from your account."
                : "We couldn't process your payment. This might be due to insufficient funds, a bank timeout, or incorrect card details."}
            </p>

            {/* Reassurance Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start text-left gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-amber-700 uppercase tracking-wide">Don't Worry</p>
                <p className="text-xs text-amber-800/80 mt-1 font-medium">
                  Your cart items have been saved. You haven't been charged for this transaction.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link 
                href="/checkout" 
                className="flex items-center justify-center w-full bg-jozi-forest text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl hover:bg-jozi-gold hover:text-jozi-forest transition-all shadow-lg"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Payment Again
              </Link>
              
              <Link 
                href="/cart" 
                className="block w-full bg-white border border-gray-200 text-gray-600 font-bold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all"
              >
                Return to Cart
              </Link>
            </div>

          </div>
          
          {/* Footer Support Bar */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
             <div className="flex items-center justify-center gap-2 text-gray-500">
               <span className="text-xs font-bold">Having trouble?</span>
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

export default FailedPage;