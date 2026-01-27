'use client';

import React, { Suspense } from 'react';
import CustomerSidebar from '../../components/CustomerSidebar';
import { ProfileUserProvider, useProfileUser } from '@/app/contexts/ProfileUserContext';

function ProfileLayoutInner({ children }: { children: React.ReactNode }) {
  const { sidebarUser, loading } = useProfileUser();

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
    <div className="bg-jozi-cream min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-80 shrink-0">
            <CustomerSidebar user={sidebarUser} />
          </div>
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
