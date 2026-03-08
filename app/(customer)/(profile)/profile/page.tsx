'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Flame, 
  TrendingUp, 
  Award, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';
import { useProfileUser } from '@/app/contexts/ProfileUserContext';
import { getDashboardSummaryAction } from '@/app/actions/points';
import { IPointsDashboardSummary } from '@/interfaces/points/points';

export default function ProfileOverviewPage() {
  const { user } = useProfileUser();
  const [dashboardData, setDashboardData] = useState<IPointsDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await getDashboardSummaryAction(user.id);
        
        if (!response.error && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-ZA');
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    if (type.toLowerCase().includes('earn') || type.toLowerCase().includes('purchase')) {
      return <ArrowUpRight className="w-4 h-4" />;
    }
    if (type.toLowerCase().includes('redeem') || type.toLowerCase().includes('spend')) {
      return <ArrowDownRight className="w-4 h-4" />;
    }
    return <Sparkles className="w-4 h-4" />;
  };

  const getTransactionColor = (pointsChange: number) => {
    return pointsChange >= 0 ? 'text-emerald-600' : 'text-rose-600';
  };

  if (loading) {
    return (
      <div className="space-y-8 text-left animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-jozi-forest/5 h-32" />
          ))}
        </div>
        <div className="bg-white rounded-5xl p-10 border border-jozi-forest/5 h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Points Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-jozi-gold/10 to-jozi-gold/5 p-6 md:p-8 rounded-3xl border border-jozi-gold/20 shadow-soft flex items-center space-x-4 md:space-x-6">
          <div className="p-3 md:p-4 bg-jozi-gold/20 rounded-2xl text-jozi-gold">
            <Star className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available Points</p>
            <p className="text-2xl md:text-3xl font-black text-jozi-forest">{formatNumber(dashboardData?.balance.availablePoints ?? 0)}</p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-jozi-forest/5 shadow-soft flex items-center space-x-4 md:space-x-6">
          <div className="p-3 md:p-4 bg-orange-50 rounded-2xl text-orange-500">
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Points</p>
            <p className="text-2xl md:text-3xl font-black text-jozi-forest">{formatNumber(dashboardData?.balance.pendingPoints ?? 0)}</p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-jozi-forest/5 shadow-soft flex items-center space-x-4 md:space-x-6">
          <div className="p-3 md:p-4 bg-emerald-50 rounded-2xl text-emerald-500">
            <Flame className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Days Active</p>
            <p className="text-2xl md:text-3xl font-black text-jozi-forest">{dashboardData?.stats.daysActive ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Tier Information & Progress */}
      {dashboardData?.tier && (
        <div className="bg-gradient-to-br from-jozi-forest to-jozi-forest/90 rounded-5xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-jozi-gold" />
                <div>
                  <p className="text-xs font-bold text-jozi-cream/60 uppercase tracking-widest">Current Tier</p>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: dashboardData.tier.color || '#F5C563' }}>
                    {dashboardData.tier.name}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-jozi-cream/60 font-bold">Tier Level</p>
                  <p className="text-2xl font-black text-jozi-gold">{dashboardData.tier.tierLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-jozi-cream/60 font-bold">Multiplier</p>
                  <p className="text-2xl font-black text-jozi-gold">{dashboardData.tier.multiplier}x</p>
                </div>
              </div>

              {dashboardData.tier.nextTier && (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-jozi-cream/80 font-bold">Next: {dashboardData.tier.nextTier.name}</span>
                    <span className="text-jozi-gold font-black">{formatNumber(dashboardData.tier.nextTier.pointsNeeded)} points needed</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-jozi-gold to-yellow-300 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, ((dashboardData.balance.totalPoints - dashboardData.tier.minPoints) / (dashboardData.tier.nextTier.minPoints - dashboardData.tier.minPoints)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center justify-center">
              <Award className="w-48 h-48 text-white/10" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-jozi-gold/5 rounded-full blur-3xl" />
        </div>
      )}

      {/* Lifetime Stats */}
      <div className="bg-white rounded-5xl p-6 md:p-10 border border-jozi-forest/5 shadow-soft">
        <h3 className="text-xl md:text-2xl font-black text-jozi-forest uppercase tracking-tight mb-6">Lifetime Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest">Total Earned</p>
            </div>
            <p className="text-3xl font-black text-jozi-forest">{formatNumber(dashboardData?.lifetime.totalEarned ?? 0)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-rose-600">
              <Gift className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest">Total Redeemed</p>
            </div>
            <p className="text-3xl font-black text-jozi-forest">{formatNumber(dashboardData?.lifetime.totalRedeemed ?? 0)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-jozi-gold">
              <Sparkles className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest">Net Points</p>
            </div>
            <p className="text-3xl font-black text-jozi-forest">{formatNumber(dashboardData?.lifetime.netPoints ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Expiring Points Alert */}
      {(dashboardData?.stats.pointsExpiringThisMonth ?? 0) > 0 && dashboardData && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-black text-amber-900 text-lg">Points Expiring Soon</h4>
            <p className="text-amber-700 font-medium mt-1">
              <span className="font-black text-xl">{formatNumber(dashboardData.stats.pointsExpiringThisMonth)}</span> points will expire this month. 
              <Link href="/profile/points" className="text-amber-900 underline font-bold ml-2">View details</Link>
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-5xl p-6 md:p-10 border border-jozi-forest/5 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-black text-jozi-forest uppercase tracking-tight">Recent Activity</h3>
          <Link href="/profile/points" className="text-sm font-bold text-jozi-gold hover:underline">View All</Link>
        </div>

        {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${activity.pointsChange >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {getTransactionIcon(activity.transactionType)}
                  </div>
                  <div>
                    <p className="font-bold text-jozi-forest capitalize">{activity.transactionType.replace(/_/g, ' ')}</p>
                    {activity.description && (
                      <p className="text-xs text-gray-500 font-medium">{activity.description}</p>
                    )}
                    <p className="text-xs text-gray-400 font-medium mt-1">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
                <div className={`text-right ${getTransactionColor(activity.pointsChange)}`}>
                  <p className="text-xl font-black">{activity.pointsChange >= 0 ? '+' : ''}{formatNumber(activity.pointsChange)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No activity yet. Start earning points!</p>
          </div>
        )}
      </div>
    </div>
  );
}

