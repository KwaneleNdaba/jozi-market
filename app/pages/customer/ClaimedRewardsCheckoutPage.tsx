'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Lock, 
  User, 
  MapPin, 
  Truck, 
  ShieldCheck,
  CheckCircle2,
  Gift,
  Package,
  AlertCircle,
  Loader2,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUserAction, updateUserAddressAction } from '@/app/actions/auth/auth';
import { generateCampaignClaimPaymentAction } from '@/app/actions/payfast';
import type { IUser } from '@/interfaces/auth/auth';
import type { ICampaignClaim } from '@/interfaces/campaign-claim/campaign-claim';

interface ClaimedRewardsCheckoutPageProps {
  pendingClaims: ICampaignClaim[];
}

const ClaimedRewardsCheckoutPage: React.FC<ClaimedRewardsCheckoutPageProps> = ({ pendingClaims }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // User data state
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const shippingCost = shippingMethod === 'express' ? 150 : 75;
  const claimIds = useMemo(() => pendingClaims.map(claim => claim.id), [pendingClaims]);
  const totalItems = pendingClaims.length;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true);
      try {
        const response = await getCurrentUserAction();
        if (!response.error && response.data) {
          const userData = response.data;
          setUser(userData);
          // Pre-fill form fields
          setFullName(userData.fullName || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
          
          // Parse address if it exists
          if (userData.address) {
            const addressParts = userData.address.split(',').map((part: string) => part.trim());
            if (addressParts.length >= 3) {
              setStreetAddress(addressParts[0] || '');
              setSuburb(addressParts[1] || '');
              setPostalCode(addressParts[2] || '');
            } else {
              setStreetAddress(userData.address);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Construct delivery address object
      const deliveryAddress = {
        street: streetAddress,
        city: suburb,
        postal: postalCode,
        country: 'South Africa',
        province: 'Gauteng',
      };
      
      // Update user address if checkbox is checked
      if (saveAddress) {
        const addressString = `${streetAddress}, ${suburb}, ${postalCode}`;
        const updateResponse = await updateUserAddressAction(addressString);
        if (updateResponse.error) {
          console.error('Error updating address:', updateResponse.message);
        }
      }
      
      // Generate PayFast payment URL for campaign claims
      const paymentResponse = await generateCampaignClaimPaymentAction({
        email,
        phone: phone || undefined,
        fullName: fullName || undefined,
        deliveryAddress,
        campaignClaimIds: claimIds,
        deliveryFee: shippingCost,
      });
      
      if (paymentResponse.error || !paymentResponse.data) {
        alert(paymentResponse.message || 'Failed to generate payment URL. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      // Redirect to PayFast payment URL
      if (paymentResponse.data.paymentUrl) {
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        alert('Payment URL not received. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (pendingClaims.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-jozi-forest/5 rounded-full flex items-center justify-center mx-auto text-jozi-forest">
            <Gift className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-jozi-forest">No Pending Claims</h2>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">You don't have any claimed rewards awaiting delivery.</p>
          <Link href="/profile/claimed-rewards" className="inline-block bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black shadow-xl">View My Claims</Link>
        </div>
      </div>
    );
  }

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading your information...</p>
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
              className="fixed inset-0 z-200 bg-jozi-dark flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[4rem] p-12 lg:p-20 max-w-2xl w-full text-center space-y-8 shadow-2xl"
              >
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-jozi-forest tracking-tighter">Payment Confirmed!</h2>
                  <p className="text-xl text-gray-500 font-medium">Your free rewards are being prepared for delivery. We've sent a confirmation to your email.</p>
                </div>
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <Link href="/profile/claimed-rewards" className="grow bg-jozi-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-jozi-dark transition-all">View My Claims</Link>
                  <Link href="/" className="grow bg-jozi-cream text-jozi-forest py-5 rounded-2xl font-black uppercase tracking-widest">Back to Market</Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-12">
          <Link href="/profile/claimed-rewards" className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-jozi-forest transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Claims
          </Link>
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
              <section className="bg-white rounded-5xl p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Lerato Dlamini" 
                      className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 82 000 0000" 
                      className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address (for order updates)</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lerato@example.co.za" 
                      className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-white rounded-5xl p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Delivery Hub</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="12 Gwigwi Mrwebi Street" 
                      className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Suburb / Area</label>
                      <input 
                        type="text" 
                        required
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="Newtown" 
                        className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Postal Code</label>
                      <input 
                        type="text" 
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="2001" 
                        className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-jozi-gold/5 rounded-2xl border border-jozi-gold/10">
                    <input 
                      type="checkbox" 
                      id="save-address"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-5 h-5 accent-jozi-forest rounded" 
                    />
                    <label htmlFor="save-address" className="text-xs font-bold text-jozi-forest/60">Save this address to my profile for future orders</label>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="bg-white rounded-5xl p-10 shadow-soft border border-jozi-forest/5 space-y-8">
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
                    className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${shippingMethod === 'standard' ? 'border-jozi-forest bg-jozi-forest/5' : 'border-gray-100 hover:border-jozi-gold/20'}`}
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
                    className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${shippingMethod === 'express' ? 'border-jozi-forest bg-jozi-forest/5' : 'border-gray-100 hover:border-jozi-gold/20'}`}
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
              <section className="bg-white rounded-5xl p-10 shadow-soft border border-jozi-forest/5 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Payment Hub</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl border-2 border-jozi-gold bg-jozi-gold/5 flex items-center justify-between group cursor-pointer transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full border-2 border-jozi-gold flex items-center justify-center">
                        <div className="w-2 h-2 bg-jozi-gold rounded-full" />
                      </div>
                      <div>
                        <p className="font-black text-jozi-forest text-sm">PayFast Secure Payment</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Card, EFT, SnapScan</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jozi-gold transition-colors" />
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="bg-jozi-dark rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <Gift className="absolute -bottom-6 -right-6 w-32 h-32 text-jozi-gold opacity-5 group-hover:scale-110 transition-transform duration-700" />
                
                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 flex items-center">
                  Claimed Rewards
                  <span className="ml-auto text-sm opacity-60">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                </h3>

                <div className="space-y-6 max-h-64 overflow-y-auto pr-4 scrollbar-hide mb-8">
                  {pendingClaims.map((claim) => {
                    const product = claim.campaign?.product;
                    const variant = claim.campaign?.variant;
                    const productImage = product?.images?.[0]?.file || '/placeholder-product.jpg';
                    const displayName = variant?.name 
                      ? `${product?.title} - ${variant.name}` 
                      : product?.title || 'Claimed Product';
                    
                    return (
                      <div key={claim.id} className="flex items-center space-x-4 pb-6 border-b border-white/10 last:border-0">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative">
                          <Image
                            src={productImage}
                            alt={displayName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-sm line-clamp-2">{displayName}</p>
                          <p className="text-xs text-white/40 font-medium mt-1">Free Reward</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium opacity-60">Products</span>
                    <span className="font-black text-emerald-400">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium opacity-60">Delivery Fee</span>
                    <span className="font-black">R{shippingCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-8 pt-8 border-t border-dashed border-white/20 space-y-4">
                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-gold mb-1">Delivery Fee</p>
                      <p className="text-4xl font-black tracking-tighter">R{shippingCost.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-white/30 uppercase">Products FREE</p>
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
                      <span>Confirm & Pay Delivery</span>
                    </div>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center space-x-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 w-auto" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 w-auto" />
                  <img src="https://seeklogo.com/images/P/payfast-logo-5E6B658C0A-seeklogo.com.png" alt="PayFast" className="h-4 w-auto" />
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-white p-8 rounded-5xl border border-jozi-forest/5 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-jozi-forest">Secure Payment</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Your payment information is encrypted and secure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-jozi-gold/10 rounded-xl flex items-center justify-center text-jozi-gold shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-jozi-forest">Free Rewards</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Products are free - you only pay delivery</p>
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

export default ClaimedRewardsCheckoutPage;
