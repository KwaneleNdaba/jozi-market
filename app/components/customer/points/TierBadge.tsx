'use client';

import React, { useEffect, useState } from 'react';
import { getAllTiersAction } from '@/app/actions/points';
import type { ITier } from '@/interfaces/points/points';
import { Crown, Star } from 'lucide-react';

interface TierBadgeProps {
  tierId?: string | null;
  points?: number;
  showDetails?: boolean;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ 
  tierId, 
  points, 
  showDetails = false,
  className = '' 
}) => {
  const [tier, setTier] = useState<ITier | null>(null);
  const [allTiers, setAllTiers] = useState<ITier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      setLoading(true);
      const response = await getAllTiersAction();
      
      if (!response.error && response.data) {
        const sortedTiers = response.data.sort((a, b) => a.tierLevel - b.tierLevel);
        setAllTiers(sortedTiers);
        
        if (tierId) {
          const currentTier = sortedTiers.find(t => t.id === tierId);
          setTier(currentTier || null);
        } else if (points !== undefined) {
          // Find tier based on points
          const currentTier = sortedTiers
            .reverse()
            .find(t => points >= t.minPoints);
          setTier(currentTier || null);
        }
      }
      setLoading(false);
    };

    fetchTiers();
  }, [tierId, points]);

  if (loading) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-100 animate-pulse ${className}`}>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!tier) {
    return null;
  }

  const getTierColor = (tierLevel: number) => {
    if (tierLevel === 1) return 'from-amber-700 to-amber-900'; // Bronze
    if (tierLevel === 2) return 'from-gray-400 to-gray-600'; // Silver
    if (tierLevel === 3) return 'from-yellow-400 to-yellow-600'; // Gold
    if (tierLevel === 4) return 'from-purple-500 to-purple-700'; // Platinum
    return 'from-blue-500 to-blue-700'; // Default
  };

  const getTierIcon = (tierLevel: number) => {
    if (tierLevel >= 3) return <Crown className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const progressToNextTier = () => {
    if (!points) return null;
    
    const nextTier = allTiers.find(t => t.tierLevel > tier.tierLevel);
    if (!nextTier) return null;

    const currentMin = tier.minPoints;
    const nextMin = nextTier.minPoints;
    const progress = ((points - currentMin) / (nextMin - currentMin)) * 100;

    return {
      nextTier,
      progress: Math.min(Math.max(progress, 0), 100),
      pointsNeeded: Math.max(nextMin - points, 0),
    };
  };

  const nextTierProgress = progressToNextTier();

  return (
    <div className={className}>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTierColor(tier.tierLevel)} text-white shadow-md`}>
        {getTierIcon(tier.tierLevel)}
        <span className="font-semibold text-sm">{tier.name}</span>
        {tier.multiplier > 1 && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {tier.multiplier}x
          </span>
        )}
      </div>

      {showDetails && nextTierProgress && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress to {nextTierProgress.nextTier.name}</span>
            <span className="font-semibold text-gray-900">
              {nextTierProgress.pointsNeeded.toLocaleString()} pts needed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getTierColor(tier.tierLevel)} transition-all duration-300`}
              style={{ width: `${nextTierProgress.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
