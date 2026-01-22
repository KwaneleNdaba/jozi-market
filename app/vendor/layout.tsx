'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, X, Loader2 } from 'lucide-react';
import VendorSidebar from '../components/VendorSidebar';
import { getMyActiveSubscriptionAction } from '@/app/actions/subscription';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth',
  status: 'Open',
  verification: 'Verified',
  deliveryMode: 'Platform-Delivery',
  stockHealth: 'Low Stock (2)'
};

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if current route is an auth page, subscription page, or subscription payment pages
  const isAuthPage = pathname === '/vendor/signin' || pathname === '/vendor/forgot-password';
  const isSubscriptionPage = pathname === '/vendor/subscription';
  const isSubscriptionSuccessPage = pathname === '/vendor/subscription/success';
  const isSubscriptionFailedPage = pathname === '/vendor/subscription/failed';
  const hideSidebar = isAuthPage || isSubscriptionPage || isSubscriptionSuccessPage || isSubscriptionFailedPage;
  
  // Check for active subscription on protected routes
  useEffect(() => {
    const checkSubscription = async () => {
      // Skip check on auth and subscription pages
      if (hideSidebar) {
        setIsCheckingSubscription(false);
        return;
      }

      try {
        setIsCheckingSubscription(true);
        const subscriptionResponse = await getMyActiveSubscriptionAction();
        
        // If no active subscription found, redirect to subscription page
        if (subscriptionResponse.error || !subscriptionResponse.data) {
          router.push('/vendor/subscription');
          return;
        }
        
        // User has active subscription, allow access
        setIsCheckingSubscription(false);
      } catch (error) {
        // On error, redirect to subscription page as safe fallback
        console.error('[Vendor Layout] Error checking subscription:', error);
        router.push('/vendor/subscription');
      }
    };

    checkSubscription();
  }, [pathname, hideSidebar, router]);

  // Show loading state while checking subscription
  if (isCheckingSubscription && !hideSidebar) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mx-auto" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Verifying Subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex overflow-hidden ${hideSidebar ? 'bg-jozi-cream' : 'bg-[#FDFCFB]'}`}>
      {/* Desktop Sidebar (Fixed) - Hidden on auth and subscription pages */}
      {!hideSidebar && (
        <div className="hidden lg:block w-72 h-screen shrink-0 sticky top-0 border-r border-gray-100">
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            <VendorSidebar vendor={VENDOR_PROFILE} />
          </div>
        </div>
      )}

      {/* Mobile Sidebar (Drawer) - Hidden on auth and subscription pages */}
      {!hideSidebar && (
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-jozi-dark/60 backdrop-blur-sm z-100 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-white z-101 lg:hidden shadow-2xl p-4 overflow-y-auto"
              >
                <div className="flex justify-end mb-4">
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-jozi-forest">
                     <X className="w-6 h-6" />
                  </button>
                </div>
                <VendorSidebar vendor={VENDOR_PROFILE} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main Content Area */}
      <div className="grow flex flex-col h-screen overflow-hidden">
        {/* Vendor Top Bar - Hidden on auth and subscription pages */}
        {!hideSidebar && (
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-jozi-dark hover:bg-gray-100 rounded-xl transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex items-center space-x-3 text-gray-400">
                 <Search className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Workshop Search</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <button className="p-2.5 text-gray-400 hover:text-jozi-forest transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-jozi-gold rounded-full border-2 border-white" />
              </button>
              
              <div className="h-8 w-px bg-gray-100 hidden md:block" />
              
              <button className="flex items-center space-x-3 pl-2 group">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-jozi-dark leading-none">Artisan Master</p>
                    <p className="text-[9px] font-bold text-jozi-gold uppercase tracking-widest mt-1">Growth Tier</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-jozi-cream flex items-center justify-center text-jozi-forest border border-jozi-forest/10 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                    <img src={VENDOR_PROFILE.logo} className="w-full h-full object-cover" alt="Vendor logo" />
                 </div>
              </button>
            </div>
          </header>
        )}

        {/* Scrollable Page Content */}
        <main className={`grow overflow-y-auto custom-scrollbar ${hideSidebar ? '' : 'bg-[#FDFCFB] p-6 lg:p-10'}`}>
          <Suspense> {children}</Suspense>
        </main>
      </div>
    </div>
  );
}
