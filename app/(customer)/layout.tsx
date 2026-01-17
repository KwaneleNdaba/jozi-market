'use client';

import React, { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../contexts/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow pt-20 bg-jozi-cream">
    <Suspense>
    {children}
    </Suspense>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
