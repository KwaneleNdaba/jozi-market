'use client';

import React, { Suspense, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import BottomNav from '../components/mobile/BottomNav';
import { useCart } from '../contexts/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCartOpen, setIsCartOpen } = useCart();

  // Listen for cart open events from BottomNav
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, [setIsCartOpen]);

  return (
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow pt-14 md:pt-16 bg-white min-h-screen">
        <Suspense fallback={
          <div className="p-4 space-y-4 md:space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl md:rounded-3xl h-48 md:h-80" />
            ))}
          </div>
        }>
          {children}
        </Suspense>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BottomNav />
    </div>
  );
}
