'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, User, X } from 'lucide-react';
import VendorSidebar from '../VendorSidebar';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth',
  status: 'Open',
  verification: 'Verified',
  deliveryMode: 'Platform-Delivery',
  stockHealth: 'Low Stock (2)'
};

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex overflow-hidden">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block w-72 h-screen shrink-0 sticky top-0 border-r border-gray-100">
        <div className="h-full overflow-y-auto custom-scrollbar p-4">
          <VendorSidebar vendor={VENDOR_PROFILE} />
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-jozi-dark/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[101] lg:hidden shadow-2xl p-4 overflow-y-auto"
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

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Vendor Top Bar */}
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
            
            <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
            
            <button className="flex items-center space-x-3 pl-2 group">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-jozi-dark leading-none">Artisan Master</p>
                  <p className="text-[9px] font-bold text-jozi-gold uppercase tracking-widest mt-1">Growth Tier</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-jozi-cream flex items-center justify-center text-jozi-forest border border-jozi-forest/10 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                  <img src={VENDOR_PROFILE.logo} className="w-full h-full object-cover" />
               </div>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-grow overflow-y-auto bg-[#FDFCFB] custom-scrollbar p-6 lg:p-10">
           {children}
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;