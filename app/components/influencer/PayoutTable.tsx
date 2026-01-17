import React from 'react';
import { motion } from 'framer-motion';
// Add missing Info import from lucide-react
import { 
  DollarSign, Clock, CheckCircle2, MoreVertical, 
  ArrowDownLeft, History, Download, ExternalLink, Landmark,
  Info
} from 'lucide-react';
import StatusBadge from './Badge';

interface PayoutTableProps {
  payouts: any[];
}

const PayoutTable: React.FC<PayoutTableProps> = ({ payouts }) => {
  return (
    <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Commission Ledger</h3>
          <p className="text-gray-400 text-sm font-medium italic">Chronological audit of settlement cycles and pending capital.</p>
        </div>
        <div className="flex gap-3">
           <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all">
              <Download className="w-5 h-5" />
           </button>
           <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jozi-forest/10 hover:bg-jozi-dark transition-all">
              Statement Export
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cycle ID / Destination</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Source Workshop</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Executed Date</th>
              <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Amount (ZAR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payouts.map((p, i) => (
              <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-jozi-cream rounded-xl flex items-center justify-center text-jozi-forest shrink-0">
                      <Landmark className="w-5 h-5 opacity-40" />
                    </div>
                    <div>
                      <p className="font-black text-jozi-dark text-sm leading-none mb-1">{p.id}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">••• 9901 Settlement</p>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex items-center text-jozi-forest font-bold text-xs uppercase tracking-widest">
                    {p.vendor}
                  </div>
                </td>
                <td className="py-6">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-6 text-center text-xs font-bold text-gray-400">
                  {p.date}
                </td>
                <td className="py-6 text-right">
                   <div className="flex items-center justify-end space-x-3">
                      <p className={`font-black text-lg ${p.status === 'Pending' ? 'text-gray-400' : 'text-emerald-600'}`}>
                        {p.amount}
                      </p>
                      <button className="p-2 text-gray-200 hover:text-jozi-gold opacity-0 group-hover:opacity-100 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-12 p-8 bg-jozi-cream/50 rounded-4xl border border-jozi-forest/5 flex items-center justify-between">
         <div className="flex items-start space-x-5 text-left">
            <div className="p-3 bg-white rounded-2xl text-jozi-gold shadow-sm"><Info className="w-5 h-5" /></div>
            <div>
               <h4 className="font-black text-jozi-forest text-sm uppercase">Automatic Thresholds</h4>
               <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-lg">
                 Commissions are settled automatically every Friday once your available balance exceeds <span className="font-bold">R500</span>. Settlement fees are covered by Jozi Market.
               </p>
            </div>
         </div>
         <button className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em] hover:text-jozi-forest transition-colors">
            Protocol Audit &rarr;
         </button>
      </div>
    </div>
  );
};

export default PayoutTable;