'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getMyClaimsAction } from '@/app/actions/campaign-claim';
import ClaimedRewardsCheckoutPage from '@/app/pages/customer/ClaimedRewardsCheckoutPage';
import type { ICampaignClaim } from '@/interfaces/campaign-claim/campaign-claim';

const ClaimedRewardsCheckoutRoute: React.FC = () => {
  const router = useRouter();
  const [pendingClaims, setPendingClaims] = useState<ICampaignClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingClaims = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getMyClaimsAction();
        
        if (response.error || !response.data) {
          setError(response.message || 'Failed to fetch claimed rewards');
          setPendingClaims([]);
        } else {
          // Filter only pending claims (those that need delivery payment)
          const pending = response.data.filter(claim => claim.status === 'pending');
          
          if (pending.length === 0) {
            // Redirect back if no pending claims
            router.push('/profile/claimed-rewards');
            return;
          }
          
          setPendingClaims(pending);
        }
      } catch (err: any) {
        console.error('Error fetching pending claims:', err);
        setError(err?.message || 'Failed to fetch pending claims');
        setPendingClaims([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingClaims();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-rose-200 p-8 max-w-md">
          <div className="flex items-center space-x-3 text-rose-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <div>
              <p className="font-black text-lg">Error Loading Checkout</p>
              <p className="text-sm text-rose-500 font-medium mt-1">{error}</p>
            </div>
          </div>
          <Link 
            href="/profile/claimed-rewards"
            className="block w-full text-center bg-jozi-forest text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-jozi-dark transition-colors"
          >
            Back to Claims
          </Link>
        </div>
      </div>
    );
  }

  return <ClaimedRewardsCheckoutPage pendingClaims={pendingClaims} />;
};

export default ClaimedRewardsCheckoutRoute;
