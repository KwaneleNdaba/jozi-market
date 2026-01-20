'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-jozi-dark/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-jozi-cream shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-jozi-forest/10 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6 text-jozi-forest" />
                <h2 className="text-xl font-bold text-jozi-forest">Your Cart <span className="text-jozi-gold">({totalItems})</span></h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-jozi-forest/5 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-jozi-forest/30" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-jozi-forest">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mt-1">Looks like you haven&apos;t found any local treasures yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-jozi-forest text-white px-8 py-3 rounded-full font-bold hover:bg-jozi-forest/90 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-jozi-forest/5 shadow-sm bg-jozi-cream">
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400'} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-jozi-forest text-sm leading-tight">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            {item.vendor.logo && (
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-jozi-forest/10 shrink-0">
                                <img 
                                  src={item.vendor.logo} 
                                  alt={item.vendor.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Hide logo if it fails to load
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <p className="text-[10px] text-jozi-gold font-bold uppercase truncate">{item.vendor.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center bg-white border border-jozi-forest/10 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-jozi-gold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-jozi-forest">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-jozi-gold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-jozi-forest">R{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-jozi-forest/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>R{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-jozi-forest font-bold">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-jozi-forest pt-2 border-t border-dashed border-jozi-forest/10">
                    <span>Total</span>
                    <span>R{totalPrice}</span>
                  </div>
                </div>
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-jozi-forest text-white py-4 rounded-xl font-bold flex items-center justify-center group hover:bg-jozi-forest/95 transition-all shadow-xl shadow-jozi-forest/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full py-2 text-sm font-bold text-gray-400 hover:text-jozi-forest transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
