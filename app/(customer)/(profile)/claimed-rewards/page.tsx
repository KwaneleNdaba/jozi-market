'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Package,
  Clock,
  CheckCircle,
  ShoppingCart,
  Sparkles,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getMyClaimsAction } from '@/app/actions/campaign-claim';
import type { ICampaignClaim, ClaimStatus } from '@/interfaces/campaign-claim/campaign-claim';

const ClaimedRewardsPage: React.FC = () => {
  const [claims, setClaims] = useState<ICampaignClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');

  // Fetch claimed rewards
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyClaimsAction();

        if (response.error || !response.data) {
          setError(response.message || 'Failed to fetch claimed rewards');
          setClaims([]);
        } else {
          setClaims(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching claims:', err);
        setError(err?.message || 'Failed to fetch claimed rewards');
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Get status badge
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1.5" />
            Awaiting Delivery
          </span>
        );
      case 'fulfilled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 mr-1.5" />
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter claims
  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === filter);

  // Calculate stats
  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    fulfilled: claims.filter(c => c.status === 'fulfilled').length,
    totalPoints: claims.reduce((acc, claim) => 
      acc + (claim.campaign?.pointsRequired || 0), 0
    ),
  };

  // Get pending claims count (these need checkout for delivery)
  const pendingClaims = filteredClaims.filter(c => c.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-jozi-forest/5 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-jozi-gold animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading your claimed rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-rose-200 p-8">
          <div className="flex items-center space-x-3 text-rose-600">
            <AlertCircle className="w-8 h-8" />
            <div>
              <p className="font-black text-lg">Error Loading Claims</p>
              <p className="text-sm text-rose-500 font-medium mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-jozi-gold/10 rounded-2xl mb-2">
              <Gift className="w-8 h-8 text-jozi-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-jozi-forest tracking-tight">
              My Claimed Rewards
            </h1>
            <p className="text-gray-600 font-medium max-w-2xl mx-auto">
              Review and checkout your claimed free products. Your rewards are ready!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-jozi-forest/5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-jozi-forest" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Claims</span>
              </div>
              <p className="text-2xl font-black text-jozi-forest">{stats.total}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-jozi-forest/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pending</span>
              </div>
              <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-jozi-forest/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fulfilled</span>
              </div>
              <p className="text-2xl font-black text-emerald-600">{stats.fulfilled}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-jozi-forest/5 inline-flex gap-2">
            {(['all', 'pending', 'fulfilled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                  filter === tab
                    ? 'bg-jozi-forest text-white shadow-md'
                    : 'text-gray-400 hover:text-jozi-forest hover:bg-gray-50'
                }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>

          {/* Claims List */}
          {filteredClaims.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-jozi-forest/5 p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-400 mb-2">
                  No {filter !== 'all' ? filter : ''} claims found
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                  {filter === 'all' 
                    ? "You haven't claimed any rewards yet. Browse campaigns to claim free products!"
                    : `You have no ${filter} claims at the moment.`
                  }
                </p>
                <Link
                  href="/games"
                  className="inline-flex items-center gap-2 bg-jozi-gold text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-jozi-gold/90 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Browse Campaigns
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredClaims.map((claim) => {
                  const campaign = claim.campaign;
                  const product = campaign?.product;
                  const variant = campaign?.variant;
                  const productImage = product?.images?.[0]?.file || '/placeholder-product.jpg';
                  const productTitle = product?.title || 'Unknown Product';
                  const variantName = variant?.name;
                  const displayName = variantName ? `${productTitle} - ${variantName}` : productTitle;

                  return (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-3xl shadow-sm border border-jozi-forest/5 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <div className="w-full md:w-32 h-48 md:h-32 rounded-2xl overflow-hidden bg-gray-100 relative">
                            <Image
                              src={productImage}
                              alt={displayName}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 128px"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow space-y-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-2">
                              <Link
                                href={`/product/${campaign?.productId}`}
                                className="text-lg font-black text-jozi-forest hover:text-jozi-gold transition-colors line-clamp-2"
                              >
                                {displayName}
                              </Link>
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="font-medium">Claimed {formatDate(claim.claimedAt)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-jozi-gold">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span className="font-bold">{campaign?.pointsRequired || 0} points</span>
                                </div>
                                {campaign?.quantity && (
                                  <div className="flex items-center gap-1.5 text-gray-500">
                                    <Package className="w-3.5 h-3.5" />
                                    <span className="font-medium">Qty: 1</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              {getStatusBadge(claim.status)}
                            </div>
                          </div>

                          {/* Vendor Info */}
                          {campaign?.vendor && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-medium">Offered by</span>
                              <Link
                                href={`/vendors/${campaign.vendorId}`}
                                className="font-black text-jozi-forest hover:text-jozi-gold transition-colors"
                              >
                                {campaign.vendor.applicant && Array.isArray(campaign.vendor.applicant)
                                  ? campaign.vendor.applicant[0]?.shopName
                                  : (campaign.vendor.applicant as any)?.shopName || 'Local Vendor'}
                              </Link>
                            </div>
                          )}

                          {/* Fulfillment Date */}
                          {claim.fulfilledAt && (
                            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Fulfilled on {formatDate(claim.fulfilledAt)}</span>
                            </div>
                          )}

                          {/* Status Info */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                            {claim.status === 'pending' && (
                              <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Awaiting delivery - Pay delivery fee to receive your reward
                              </p>
                            )}
                            {claim.status === 'fulfilled' && (
                              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Product has been delivered
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Checkout Button */}
          {pendingClaims.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-jozi-forest to-jozi-dark rounded-3xl shadow-2xl p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left text-white">
                    <p className="text-sm font-bold uppercase tracking-wide opacity-80">
                      Pay for Delivery
                    </p>
                    <p className="text-3xl font-black mt-1">
                      {pendingClaims.length} {pendingClaims.length === 1 ? 'Item' : 'Items'} Awaiting Delivery
                    </p>
                    <p className="text-sm font-medium mt-2 opacity-80">
                      Complete checkout to receive your free rewards (delivery fee applies)
                    </p>
                  </div>
                  
                  <Link
                    href="/claimed-rewards-checkout"
                    className="inline-flex items-center gap-3 bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black text-base uppercase tracking-wide hover:bg-white transition-all shadow-xl hover:shadow-2xl whitespace-nowrap"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Proceed to Checkout ({pendingClaims.length})
                    <ChevronRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
    </div>
  );
};

export default ClaimedRewardsPage;
