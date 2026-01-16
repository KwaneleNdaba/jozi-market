
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  CreditCard,
  Percent,
  ArrowUpRight,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  Wallet,
  Zap,
  RotateCcw,
  Users,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { Vendor } from '../../types';
import { vendors as MOCK_VENDORS } from '../../data/mockData';

// Extended Mock Order Data for Payouts
interface PayoutOrder {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Refunded' | 'Adjusted';
  items: string;
  adjustment?: number;
  adjustmentNote?: string;
}

const MOCK_ORDERS: Record<string, PayoutOrder[]> = {
  'v1': [
    { id: 'ORD-7721', date: '2024-10-12', amount: 1250, status: 'Completed', items: 'Shweshwe Evening Dress' },
    { id: 'ORD-7744', date: '2024-10-13', amount: 3500, status: 'Completed', items: 'Veld Boots x2' },
    { id: 'ORD-7750', date: '2024-10-14', amount: 850, status: 'Refunded', items: 'Silk Scarf', adjustment: -850, adjustmentNote: 'Return #331' },
    { id: 'ORD-7762', date: '2024-10-15', amount: 1250, status: 'Completed', items: 'Shweshwe Evening Dress' },
    { id: 'ORD-7780', date: '2024-10-15', amount: 450, status: 'Completed', items: 'Beaded Accessories' },
  ],
  'v2': [
    { id: 'ORD-8801', date: '2024-10-10', amount: 4500, status: 'Completed', items: 'Gold Studs' },
    { id: 'ORD-8812', date: '2024-10-12', amount: 2200, status: 'Completed', items: 'Silver Fern Earrings' },
  ],
  'v3': [
    { id: 'ORD-9901', date: '2024-10-11', amount: 850, status: 'Completed', items: 'Skyline Print' },
  ],
  'v4': [
    { id: 'ORD-1010', date: '2024-10-15', amount: 290, status: 'Completed', items: 'Rooibos Gift Set' },
  ]
};

const AdminVendorPayoutsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const selectedVendor = useMemo(() => 
    MOCK_VENDORS.find(v => v.id === selectedVendorId), 
  [selectedVendorId]);

  const vendorOrders = useMemo(() => 
    selectedVendorId ? (MOCK_ORDERS[selectedVendorId] || []) : [], 
  [selectedVendorId]);

  const filteredVendors = MOCK_VENDORS.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to calculate totals for any vendor
  const getVendorStats = (vid: string) => {
    const orders = MOCK_ORDERS[vid] || [];
    const vendor = MOCK_VENDORS.find(v => v.id === vid);
    if (!vendor) return { gross: 0, commission: 0, net: 0, adjustments: 0 };

    const gross = orders.reduce((acc, curr) => acc + (curr.status === 'Completed' ? curr.amount : 0), 0);
    const commissionRate = vendor.commissionRate / 100;
    const commission = gross * commissionRate;
    const adjustments = orders.reduce((acc, curr) => acc + (curr.adjustment || 0), 0);
    const net = gross - commission + adjustments;

    return { gross, commission, net, adjustments };
  };

  const selectedStats = useMemo(() => 
    selectedVendorId ? getVendorStats(selectedVendorId) : null,
  [selectedVendorId]);

  const handleTriggerPayout = () => {
    if (!selectedVendor) return;
    setIsProcessingPayout(true);
    setTimeout(() => {
      setIsProcessingPayout(false);
      alert(`Payout of R${selectedStats?.net.toLocaleString()} triggered for ${selectedVendor.name}.`);
    }, 2000);
  };

  const enterDetail = (vid: string) => {
    setSelectedVendorId(vid);
    setViewMode('detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <section className="bg-jozi-dark pt-12 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">
                {viewMode === 'list' ? 'PAYOUT HUB.' : 'VENDOR BREAKDOWN.'} <br />
                <span className="text-jozi-gold">{viewMode === 'list' ? 'ALL VENDORS' : selectedVendor?.name}</span>
              </h1>
            </div>

            {viewMode === 'list' && (
              <div className="relative w-full max-w-md">
                <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Filter payouts by artisan name..." 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-14 pr-6 py-4 font-bold text-white outline-none focus:bg-white/15 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {viewMode === 'detail' && (
              <button 
                onClick={() => setViewMode('list')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Master List
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="payout-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Summary Stats for Whole Market */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Total Pending Payouts', value: 'R124,500', icon: Wallet, color: 'text-jozi-gold' },
                  { label: 'Projected Platform Yield', value: 'R8,420', icon: TrendingUp, color: 'text-emerald-500' },
                  { label: 'Vendors Ready', value: MOCK_VENDORS.length, icon: Users, color: 'text-blue-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                      <h3 className="text-2xl font-black text-jozi-dark">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Master Payout Table */}
              <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-2xl font-black text-jozi-dark tracking-tight uppercase">Active Cycle Payouts</h2>
                   <button className="flex items-center space-x-2 bg-jozi-cream text-jozi-forest px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all">
                     <Download className="w-4 h-4" />
                     <span>Export Batch (CSV)</span>
                   </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Artisan Workshop</th>
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Plan / Rate</th>
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Gross GMV</th>
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Commissions</th>
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Net Payable</th>
                        <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredVendors.map((vendor) => {
                        const stats = getVendorStats(vendor.id);
                        return (
                          <tr key={vendor.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                                  <img src={vendor.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-black text-jozi-dark text-sm">{vendor.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{vendor.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6">
                              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                vendor.planTier === 'Pro' ? 'bg-jozi-forest text-white' : 'bg-jozi-gold/10 text-jozi-gold'
                              }`}>
                                {vendor.planTier} • {vendor.commissionRate}%
                              </span>
                            </td>
                            <td className="py-6 font-bold text-jozi-dark text-sm">R{stats.gross.toLocaleString()}</td>
                            <td className="py-6 font-bold text-red-400 text-sm">-R{stats.commission.toLocaleString()}</td>
                            <td className="py-6 text-right font-black text-emerald-600 text-lg">R{stats.net.toLocaleString()}</td>
                            <td className="py-6 text-right">
                               <button 
                                onClick={() => enterDetail(vendor.id)}
                                className="inline-flex items-center space-x-2 bg-gray-50 text-gray-500 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest hover:text-white transition-all group/btn"
                               >
                                 <Eye className="w-4 h-4" />
                                 <span>Review Breakdown</span>
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="payout-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Detail Cards (Stat Cards) */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Workshop Gross', value: `R${selectedStats?.gross.toLocaleString()}`, icon: TrendingUp, color: 'text-jozi-forest' },
                    { label: 'Platform Hit', value: `-R${selectedStats?.commission.toLocaleString()}`, icon: Percent, color: 'text-red-500' },
                    { label: 'Artisan Net', value: `R${selectedStats?.net.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 group transition-all hover:shadow-xl">
                       <div className="flex items-center justify-between mb-4">
                         <div className={`p-3 rounded-2xl ${i === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                           <stat.icon className="w-6 h-6" />
                         </div>
                       </div>
                       <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                       <h3 className={`text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</h3>
                    </div>
                  ))}
                </div>

                {/* Ledger */}
                <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-2xl font-black text-jozi-dark tracking-tight">Financial Ledger</h2>
                      <p className="text-gray-400 font-medium text-xs">Individual transaction hits for this cycle.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Transaction</th>
                          <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Date</th>
                          <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Gross</th>
                          <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Comm.</th>
                          <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {vendorOrders.map((order) => {
                          const comm = order.status === 'Completed' ? (order.amount * (selectedVendor!.commissionRate/100)) : 0;
                          const net = order.status === 'Completed' ? (order.amount - comm) : (order.adjustment || 0);
                          
                          return (
                            <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                              <td className="py-6">
                                <p className="font-black text-jozi-dark text-sm">{order.id}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">{order.items}</p>
                              </td>
                              <td className="py-6 text-xs font-bold text-gray-400">{order.date}</td>
                              <td className="py-6 font-black text-jozi-dark text-sm">R{order.amount}</td>
                              <td className="py-6 font-bold text-red-400 text-sm">{comm > 0 ? `-R${comm.toFixed(0)}` : '—'}</td>
                              <td className={`py-6 text-right font-black text-sm ${net < 0 ? 'text-red-500' : 'text-emerald-600'}`}>R{net.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="space-y-8">
                <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-16 h-16 bg-jozi-gold rounded-3xl flex items-center justify-center text-jozi-dark shadow-xl">
                          <Wallet className="w-8 h-8" />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Payout Status</p>
                          <p className="text-xl font-black">Active Cycle</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-jozi-cream/60 font-medium leading-relaxed">
                          You are about to trigger the payout for <span className="text-white font-black">{selectedVendor?.name}</span>.
                        </p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                           <p className="text-[10px] font-black uppercase text-jozi-gold">Bank Destination</p>
                           <p className="text-sm font-bold">Registered Account (••• 9901)</p>
                        </div>
                      </div>

                      <button 
                        onClick={handleTriggerPayout}
                        disabled={isProcessingPayout || !selectedStats || selectedStats.net <= 0}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center shadow-xl ${
                          isProcessingPayout || !selectedStats || selectedStats.net <= 0
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-white text-jozi-forest hover:bg-jozi-gold hover:text-jozi-dark'
                        }`}
                      >
                        {isProcessingPayout ? (
                          <div className="w-4 h-4 border-2 border-jozi-forest/30 border-t-jozi-forest rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                            Trigger Payout
                          </>
                        )}
                      </button>
                   </div>
                   <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-gray-100 space-y-8">
                  <h3 className="text-xl font-black text-jozi-dark">Compliance Check</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">KYC Verified</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Bank Details Active</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No Active Disputes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default AdminVendorPayoutsPage;
