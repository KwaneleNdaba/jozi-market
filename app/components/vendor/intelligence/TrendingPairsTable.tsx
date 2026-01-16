import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Package, Tag, Plus } from 'lucide-react';

const MOCK_PAIRS = [
  { p1: 'Shweshwe Evening Dress', p2: 'Beaded Silk Scarf', overlap: 65, uplift: '+24% AOV', status: 'High Intent' },
  { p1: 'Zebu Leather Wallet', p2: 'Leather Belt', overlap: 42, uplift: '+18% AOV', status: 'Natural Pair' },
  { p1: 'Pottery Set', p2: 'Copper Braai Set', overlap: 28, uplift: '+32% AOV', status: 'Luxe Bundle' },
  { p1: 'Marula Face Oil', p2: 'Baobab Soap', overlap: 21, uplift: '+12% AOV', status: 'Wellness Pack' },
];

const TrendingPairsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Product Duo</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-center">Cart Overlap</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-center">Revenue Yield</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Insight Class</th>
            <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Strategy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_PAIRS.map((pair, i) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-6">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <p className="font-black text-jozi-forest text-xs">{pair.p1}</p>
                    <div className="flex items-center space-x-2 mt-1 text-gray-300">
                      <Plus className="w-2 h-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{pair.p2}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-6 text-center">
                 <div className="flex flex-col items-center">
                    <span className="font-black text-jozi-dark">{pair.overlap}%</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-jozi-gold" style={{ width: `${pair.overlap}%` }} />
                    </div>
                 </div>
              </td>
              <td className="py-6 text-center">
                 <span className="text-emerald-500 font-black text-xs">{pair.uplift}</span>
              </td>
              <td className="py-6">
                 <span className="bg-jozi-cream text-jozi-forest px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-jozi-forest/5">
                   {pair.status}
                 </span>
              </td>
              <td className="py-6 text-right">
                 <button className="bg-jozi-forest text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-jozi-forest/10 hover:bg-jozi-dark transition-all opacity-0 group-hover:opacity-100 flex items-center ml-auto">
                    Create Bundle <ArrowRight className="ml-2 w-3 h-3" />
                 </button>
                 <div className="group-hover:hidden flex items-center justify-end text-gray-200">
                    <Sparkles className="w-4 h-4" />
                 </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendingPairsTable;