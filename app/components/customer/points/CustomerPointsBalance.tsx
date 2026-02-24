'use client';

import React, { useEffect, useState } from 'react';
import { getMyPointsBalanceAction, getMyPointsHistoryAction } from '@/app/actions/points';
import type { IUserPointsBalance, IPointsHistory } from '@/interfaces/points/points';
import { Coins, TrendingUp, TrendingDown, Clock, Gift } from 'lucide-react';

export const CustomerPointsBalance: React.FC = () => {
  const [balance, setBalance] = useState<IUserPointsBalance | null>(null);
  const [history, setHistory] = useState<IPointsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPointsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [balanceResponse, historyResponse] = await Promise.all([
          getMyPointsBalanceAction(),
          getMyPointsHistoryAction(),
        ]);

        if (balanceResponse.error) {
          setError(balanceResponse.message);
        } else {
          setBalance(balanceResponse.data);
        }

        if (!historyResponse.error) {
          setHistory(historyResponse.data || []);
        }
      } catch (err) {
        setError('Failed to load points data');
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-500">
          {error || 'Unable to load points balance'}
        </p>
      </div>
    );
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'redeem':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'gift_sent':
      case 'gift_received':
        return <Gift className="w-4 h-4 text-purple-600" />;
      case 'expire':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Coins className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Available Points</p>
            <p className="text-4xl font-bold mt-1">
              {balance.availablePoints.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Coins className="w-8 h-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-400/30">
          <div>
            <p className="text-emerald-100 text-xs">Pending</p>
            <p className="text-lg font-semibold">{balance.pendingPoints.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-xs">Lifetime Earned</p>
            <p className="text-lg font-semibold">{balance.lifetimeEarned.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-xs">Lifetime Redeemed</p>
            <p className="text-lg font-semibold">{balance.lifetimeRedeemed.toLocaleString()}</p>
          </div>
        </div>

        {balance.nextExpiryDate && balance.nextExpiryPoints && (
          <div className="mt-4 pt-4 border-t border-emerald-400/30">
            <p className="text-emerald-100 text-xs">Next Expiry</p>
            <p className="text-sm font-medium">
              {balance.nextExpiryPoints.toLocaleString()} points on {formatDate(balance.nextExpiryDate)}
            </p>
          </div>
        )}
      </div>

      {/* Points History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {history.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No points activity yet
            </div>
          ) : (
            history.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getTransactionIcon(transaction.transactionType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description || transaction.transactionType}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.pointsChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.pointsChange > 0 ? '+' : ''}{transaction.pointsChange.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Balance: {transaction.pointsBalanceAfter.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
