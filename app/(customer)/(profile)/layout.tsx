'use client';

import React, { Suspense, useState } from 'react';
import { Menu } from 'lucide-react';
import CustomerSidebar from '../../components/CustomerSidebar';
import MobileDrawer from '../../components/mobile/MobileDrawer';
import { ProfileUserProvider, useProfileUser } from '@/app/contexts/ProfileUserContext';

function ProfileLayoutInner({ children }: { children: React.ReactNode }) {
  const { sidebarUser, loading } = useProfileUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="bg-jozi-cream min-h-screen pb-24">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80 shrink-0 h-64 rounded-[2.5rem] bg-white/60 border border-jozi-forest/5 animate-pulse" />
            <main className="grow min-w-0 flex items-center justify-center min-h-[40vh]">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-jozi-forest rounded-full animate-spin" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jozi-cream min-h-screen pb-24 lg:pb-12">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-12 max-w-7xl">
        {/* Mobile: Header with Menu Button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-jozi-forest">
              {sidebarUser.name.split(' ')[0]}'s Account
            </h1>
            <p className="text-xs text-gray-500 font-bold">
              Level {sidebarUser.level} • {sidebarUser.points} points
            </p>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-white border border-jozi-forest/10 rounded-2xl text-jozi-forest shadow-sm active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Desktop: Sidebar */}
          <div className="hidden lg:block w-full lg:w-80 shrink-0">
            <CustomerSidebar user={sidebarUser} />
          </div>

          {/* Mobile: Drawer */}
          <MobileDrawer
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            from="left"
            className="w-[85vw] max-w-sm"
          >
            <CustomerSidebar user={sidebarUser} />
          </MobileDrawer>

          {/* Main Content */}
          <main className="grow min-w-0">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[40vh]">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-jozi-forest rounded-full animate-spin" />
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileUserProvider>
      <ProfileLayoutInner>{children}</ProfileLayoutInner>
    </ProfileUserProvider>
  );
}
