import React from 'react';
import { motion } from 'framer-motion';
// Added missing Flame to imports
import { Tag, Search, Plus, TrendingUp, RotateCcw, Copy, Check, Download, Flame } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_COUPONS = [
  { code: 'JOZI-HERITAGE', type: 'Percentage', val: '20%', status: 'Active', usage: '142 / 500', trend: '+14%' },
  { code: 'TEXTILE-50', type: 'Fixed Amount', val: 'R50', status: 'Active', usage: '85 / 100', trend: '+8%' },
  { code: 'NEIGHBOR-LOVE', type: 'Free Shipping', val: 'R75', status: 'Paused', usage: '42 / 1000', trend: '0%' },
];

const DATA = [
  { name: 'Mon', redemptions: 12 },
  { name: 'Tue', redemptions: 18 },
  { name: 'Wed', redemptions: 15 },
  { name: 'Thu', redemptions: 22 },
  { name: 'Fri', redemptions: 34 },
  { name: 'Sat', redemptions: 42 },
  { name: 'Sun', redemptions: 28 },
];

const MarketingCoupons: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Voucher Vault" 
        sub="Create and manage artisanal incentives to convert market seekers." 
        icon={Tag}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Redemption Analytics */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Redemption Pulse</h3>
                <p className="text-xs text-gray-400 font-medium">Daily voucher usage across the platform.</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-black uppercase">+22%</span>
              </div>
           </div>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA}>
                  <defs>
                    <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="redemptions" stroke="#C7A16E" strokeWidth={4} fillOpacity={1} fill="url(#colorRed)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold">
                 <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Cumulative <br />Incentive Value</h3>
              <p className="text-5xl font-black text-jozi-gold tracking-tighter">R8,420</p>
              <p className="text-xs text-jozi-cream/50 font-medium">Total discount given this quarter through active vouchers.</p>
              <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all">
                Download Fiscal Report
              </button>
           </div>
           <Flame className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search codes..." className="w-full bg-gray-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none" />
          </div>
          <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl shadow-jozi-forest/10 hover:bg-jozi-dark transition-all">
            <Plus className="w-4 h-4 mr-2" /> New Voucher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Logic Code</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Value Class</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Fleet Usage</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_COUPONS.map((coupon, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-jozi-cream p-3 rounded-xl border border-jozi-forest/5">
                        <p className="font-black text-jozi-forest text-sm">{coupon.code}</p>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-jozi-gold"><Copy className="w-3 h-3" /></button>
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="font-black text-jozi-dark text-lg">{coupon.val}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{coupon.type}</p>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-sm text-jozi-dark">{coupon.usage}</span>
                      <span className="text-[9px] font-black text-emerald-500">{coupon.trend}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                     <div className="flex items-center justify-end space-x-2">
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest"><Download className="w-4 h-4" /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Edit3 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default MarketingCoupons;