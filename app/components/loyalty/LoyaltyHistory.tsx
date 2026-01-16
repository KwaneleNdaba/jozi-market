import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Users, Star, RefreshCw, ArrowUp } from 'lucide-react';

const HISTORY = [
  { id: 1, type: 'earned', label: 'Order #ORD-7721', date: 'Oct 15, 2024', points: '+125', icon: ShoppingBag, color: 'text-emerald-500' },
  { id: 2, type: 'spent', label: 'R100 Voucher Redemption', date: 'Oct 12, 2024', points: '-950', icon: Tag, color: 'text-rose-500' },
  { id: 3, type: 'earned', label: 'Successful Referral: Thabo M.', date: 'Oct 10, 2024', points: '+500', icon: Users, color: 'text-emerald-500' },
  { id: 4, type: 'bonus', label: 'Tier Promotion: Silver Neighbor', date: 'Oct 05, 2024', points: '+250', icon: ArrowUp, color: 'text-jozi-gold' },
  { id: 5, type: 'earned', label: 'Veld Boots Review', date: 'Oct 01, 2024', points: '+150', icon: Star, color: 'text-emerald-500' },
];

const LoyaltyHistory: React.FC = () => {
  return (
    <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 text-left space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Points Lifecycle</h3>
        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {HISTORY.map((item, i) => (
          <div key={item.id} className="flex items-center justify-between group">
            <div className="flex items-center space-x-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-jozi-forest text-sm">{item.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-black ${item.color}`}>{item.points}</p>
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">{item.type}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 text-[10px] font-black text-jozi-gold uppercase tracking-[0.3em] hover:text-jozi-forest transition-colors border-t border-gray-50 pt-8">
        Full Transaction Ledger
      </button>
    </div>
  );
};

export default LoyaltyHistory;