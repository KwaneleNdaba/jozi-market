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
      <main className="grow pt-14 md:pt-16 bg-jozi-cream">
    <Suspense>
    {children}
    </Suspense>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BottomNav />
    </div>
  );
}
