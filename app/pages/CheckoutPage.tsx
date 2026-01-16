
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Tag, 
  Info,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import Logo from '../components/Logo';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  
  // State for form
  const [coupon, setCoupon] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 150 : 75;
  const finalTotal = useMemo(() => totalPrice + shippingCost - appliedDiscount, [totalPrice, shippingCost, appliedDiscount]);

  const handleApplyCoupon = () => {
    if (!coupon) return;
    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      if (coupon.toUpperCase() === 'JOZI20') {
        setAppliedDiscount(Math.floor(totalPrice * 0.2));
        setIsApplyingCoupon(false);
      } else {
        setIsApplyingCoupon(false);
        alert("Invalid coupon code. Try 'JOZI20' for a demo discount!");
      }
    }, 1000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate Payment
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      clearCart();
    }, 2500);
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-jozi-forest/5 rounded-full flex items-center justify-center mx-auto text-jozi-forest">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-jozi-forest">Your bag is empty</h2>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">Looks like you haven't added any treasures to your collection yet.</p>
          <Link to="/shop" className="inline-block bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black shadow-xl">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jozi-cream pb-24 pt-12">
      <div className="container mx-auto px-4">
        {/* Success State Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[200] bg-jozi-dark flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[4rem] p-12 lg:p-20 max-w-2xl w-full text-center space-y-8 shadow-2xl"
              >
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-jozi-forest tracking-tighter">Order Confirmed!</h2>
                  <p className="text-xl text-gray-500 font-medium">Your local treasures are being prepared at the artisan workshops. We've sent a detailed summary to your email.</p>
                </div>
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <Link to="/profile" className="flex-grow bg-jozi-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-jozi-dark transition-all">Track My Order</Link>
                  <Link to="/" className="flex-grow bg-jozi-cream text-jozi-forest py-5 rounded-2xl font-black uppercase tracking-widest">Back to Market</Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-12">
          <Link to="/shop" className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-jozi-forest transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Gallery
          </Link>
          <Logo className="h-12 w-auto opacity-40 hidden md:flex" />
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Secure Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form Details */}
          <div className="lg:w-2/3 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Personal Info */}
              <section className="bg-white rounded-[3rem] p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input required type="text" placeholder="Lerato Dlamini" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Number</label>
                    <input required type="tel" placeholder="+27 82 000 0000" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address (for order updates)</label>
                    <input required type="email" placeholder="lerato@example.co.za" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-white rounded-[3rem] p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Delivery Hub</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                    <input required type="text" placeholder="12 Gwigwi Mrwebi Street" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Suburb / Area</label>
                      <input required type="text" placeholder="Newtown" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Postal Code</label>
                      <input required type="text" placeholder="2001" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-jozi-gold/5 rounded-2xl border border-jozi-gold/10">
                    <input type="checkbox" id="save-address" className="w-5 h-5 accent-jozi-forest rounded" />
                    <label htmlFor="save-address" className="text-xs font-bold text-jozi-forest/60">Save this address to my profile for future orders</label>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="bg-white rounded-[3rem] p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Shipping Method</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${shippingMethod === 'standard' ? 'border-jozi-forest bg-jozi-forest/5' : 'border-gray-100 hover:border-jozi-gold/20'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-black uppercase tracking-widest ${shippingMethod === 'standard' ? 'text-jozi-forest' : 'text-gray-400'}`}>Standard</span>
                      <span className="font-black text-jozi-forest">R75</span>
                    </div>
                    <p className="font-bold text-jozi-forest">3-5 Work Days</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Reliable local courier partner</p>
                    {shippingMethod === 'standard' && <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-jozi-forest rounded-full flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${shippingMethod === 'express' ? 'border-jozi-forest bg-jozi-forest/5' : 'border-gray-100 hover:border-jozi-gold/20'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-black uppercase tracking-widest ${shippingMethod === 'express' ? 'text-jozi-forest' : 'text-gray-400'}`}>Priority Express</span>
                      <span className="font-black text-jozi-forest">R150</span>
                    </div>
                    <p className="font-bold text-jozi-forest">1-2 Work Days</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Faster delivery across Gauteng</p>
                    {shippingMethod === 'express' && <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-jozi-forest rounded-full flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>}
                  </button>
                </div>
              </section>

              {/* Payment Method Selector (UI Only) */}
              <section className="bg-white rounded-[3rem] p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Payment Hub</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'card', name: 'Debit / Credit Card', sub: 'PayFast Secure Payment' },
                    { id: 'eft', name: 'Instant EFT', sub: 'Instant verification via Bank' },
                    { id: 'points', name: 'Market Points', sub: `Available: ${1250} Pts` }
                  ].map((p, i) => (
                    <div key={p.id} className={`p-6 rounded-3xl border-2 flex items-center justify-between group cursor-pointer transition-all ${i === 0 ? 'border-jozi-gold bg-jozi-gold/5' : 'border-gray-50 hover:border-jozi-gold/10'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-jozi-gold' : 'border-gray-200'}`}>
                          {i === 0 && <div className="w-2 h-2 bg-jozi-gold rounded-full" />}
                        </div>
                        <div>
                          <p className="font-black text-jozi-forest text-sm">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-jozi-gold transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            </form>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="bg-jozi-dark rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-jozi-gold opacity-5 group-hover:scale-110 transition-transform duration-700" />
                
                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 flex items-center">
                  Order Summary
                  <span className="ml-auto text-xs font-black text-jozi-gold uppercase tracking-[0.2em]">{totalItems} Items</span>
                </h3>

                <div className="space-y-6 max-h-64 overflow-y-auto pr-4 scrollbar-hide mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="w-14 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={item.images[0]} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-black text-sm whitespace-nowrap">R{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input 
                        type="text" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Coupon Code" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs font-bold outline-none focus:border-jozi-gold/40"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-white text-jozi-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold hover:text-jozi-dark transition-all disabled:opacity-50"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-2 text-emerald-400 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Coupon Applied: -R{appliedDiscount}</span>
                    </motion.div>
                  )}
                </div>

                {/* Calculation */}
                <div className="mt-8 pt-8 border-t border-dashed border-white/20 space-y-4">
                  <div className="flex justify-between text-white/60 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>R{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm font-medium">
                    <span>Local Shipping</span>
                    <span>R{shippingCost}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 text-sm font-bold">
                      <span>Discount</span>
                      <span>-R{appliedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-gold mb-1">Grand Total</p>
                      <p className="text-4xl font-black tracking-tighter">R{finalTotal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-white/30 uppercase">Incl. VAT</p>
                    </div>
                  </div>
                </div>

                <button 
                  form="checkout-form"
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full mt-10 py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center shadow-2xl ${isProcessing ? 'bg-white/10 text-white cursor-not-allowed' : 'bg-jozi-gold text-jozi-dark hover:bg-white hover:scale-[1.02]'}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Pay Now</span>
                    </div>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center space-x-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 w-auto" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 w-auto" />
                  <img src="https://seeklogo.com/images/P/payfast-logo-5E6B658C0A-seeklogo.com.png" className="h-4 w-auto" />
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-white p-8 rounded-[3rem] border border-jozi-forest/5 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-jozi-forest uppercase tracking-widest">Returns Protected</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Artisan pieces are eligible for returns within 30 days if received in original workshop condition.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-jozi-forest uppercase tracking-widest">Hub Inspection</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Each piece passes through our Joburg Hub for authenticity verification before being couriered to you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
