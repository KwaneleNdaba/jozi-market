import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingDown, 
  ArrowUpRight, 
  Package, 
  RefreshCw,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import SectionHeader from '../SectionHeader';

const MOCK_ALERTS = [
  { id: 'a1', product: 'Indigo Silk Scarf', variant: 'One Size', stock: 1, dailyBurn: 0.8, prediction: 'Stock out in 24h', severity: 'Critical' },
  { id: 'a2', product: 'Zebu Leather Wallet', variant: 'Tanned Brown', stock: 2, dailyBurn: 0.2, prediction: 'Stock out in 4 days', severity: 'Low' },
  { id: 'a3', product: 'Shweshwe Evening Dress', variant: 'Indigo / Large', stock: 3, dailyBurn: 1.2, prediction: 'Stock out in 48h', severity: 'Medium' },
];

const InventoryStockAlerts: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Stock Alarms" 
        sub="Predictive inventory monitoring to prevent lost revenue opportunities." 
        icon={AlertTriangle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Alarms */}
        <div className="lg:col-span-2 space-y-4">
           {MOCK_ALERTS.map((alert, i) => (
             <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={alert.id} 
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl transition-all"
             >
                <div className="flex items-center space-x-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                     alert.severity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'
                   }`}>
                      <TrendingDown className="w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-jozi-forest leading-tight">{alert.product}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Variant: {alert.variant} • {alert.stock} Left</p>
                   </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex-grow max-w-xs">
                   <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1">AI Prediction</p>
                   <p className={`font-black text-sm ${alert.severity === 'Critical' ? 'text-rose-600' : 'text-orange-600'}`}>{alert.prediction}</p>
                </div>

                <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jozi-forest/10 hover:bg-jozi-dark transition-all flex items-center">
                   <RefreshCw className="w-4 h-4 mr-2" /> Restock Now
                </button>
             </motion.div>
           ))}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
           <div className="bg-jozi-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark shadow-xl">
                       <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-jozi-gold">Burn Rate</p>
                       <p className="text-2xl font-black">22 Units/Day</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase leading-tight">Bulk Restock Recommendation</h3>
                    <p className="text-xs text-jozi-cream/40 font-medium leading-relaxed italic">"Our models recommend a batch order of <span className="text-white font-bold">50 Silk Scarves</span> to capture the predicted weekend demand spike."</p>
                 </div>
                 <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">Generate P.O.</button>
              </div>
              <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 space-y-6 text-left">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="p-2 bg-jozi-forest/5 rounded-xl text-jozi-forest"><Info className="w-5 h-5" /></div>
                 <h4 className="text-sm font-black uppercase text-jozi-dark">Global Log</h4>
              </div>
              <div className="space-y-6">
                 {[
                   { t: '12m ago', d: 'Wallet "Brown" restocked (+10)' },
                   { t: '2h ago', d: 'Scarf "Indigo" triggered Critical Alarm' },
                   { t: 'Yesterday', d: 'Dress "Small" sold out' },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-start text-xs border-b border-gray-50 pb-4 last:border-0">
                      <p className="font-bold text-gray-400 mr-4 whitespace-nowrap">{log.t}</p>
                      <p className="font-black text-jozi-forest text-right leading-tight">{log.d}</p>
                   </div>
                 ))}
              </div>
              <button className="text-[10px] font-black text-jozi-gold uppercase tracking-widest flex items-center hover:underline">
                 Full Audit History <ChevronRight className="ml-1 w-3 h-3" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStockAlerts;
