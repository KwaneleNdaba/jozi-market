'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, User } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Check if current route is an auth page
  const isAuthPage = pathname === '/admin/signin';

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar (Fixed) - Hidden on auth pages */}
      {!isAuthPage && (
        <AnimatePresence mode="wait">
          {isDesktopSidebarOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 288 }}
              exit={{ width: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:block h-screen shrink-0 sticky top-0 border-r border-white/5 overflow-hidden"
            >
              <AdminSidebar />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Sidebar (Drawer) - Hidden on auth pages */}
      {!isAuthPage && (
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
                className="fixed left-0 top-0 bottom-0 w-80 bg-jozi-dark z-101 lg:hidden"
              >
                <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main Content Area */}
      <div className="grow flex flex-col h-screen overflow-hidden">
        {/* Admin Top Bar - Hidden on auth pages */}
        {!isAuthPage && (
          <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-jozi-dark hover:bg-gray-100 rounded-xl transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                className="hidden lg:block p-2 text-jozi-dark hover:bg-gray-100 rounded-xl transition-all"
                title={isDesktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex items-center space-x-3 text-gray-400">
                 <Search className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Command Search</span>
                 <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded border border-gray-200">⌘ K</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest whitespace-nowrap">Platform Online</span>
              </div>
              
              <button className="p-2.5 text-gray-400 hover:text-jozi-forest transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-jozi-gold rounded-full border-2 border-white" />
              </button>
              
              <div className="h-8 w-px bg-gray-100 hidden md:block" />
              
              <button className="flex items-center space-x-3 pl-2 group">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-jozi-dark leading-none">Admin Oracle</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 group-hover:text-jozi-gold transition-colors">Session Active</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-jozi-forest flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                 </div>
              </button>
            </div>
          </header>
        )}

        {/* Dynamic Route Content */}
        <main className={`grow overflow-y-auto bg-gray-50 custom-scrollbar ${isAuthPage ? '' : ''}`}>
           {children}
        </main>
      </div>
    </div>
  );
}
