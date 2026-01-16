import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit3, XCircle, Calendar, Package, User } from 'lucide-react';
import Badge from './Badge';

interface CampaignTableProps {
  campaigns: any[];
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  return (
    <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden text-left">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Active Manifest</h3>
          <p className="text-gray-400 text-sm font-medium italic">Track your ongoing collaborations and content delivery.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Creator / ID</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Featured Piece</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Timeline</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Budget</th>
              <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
              <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campaigns.map((c) => (
              <motion.tr 
                layout
                key={c.id} 
                className="group hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-jozi-cream rounded-xl flex items-center justify-center text-jozi-forest">
                      <User className="w-6 h-6 opacity-40" />
                    </div>
                    <div>
                      <p className="font-black text-jozi-dark text-sm leading-none mb-1">{c.influencer}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ref: {c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-8">
                  <div className="flex items-center text-jozi-forest font-bold text-xs">
                    <Package className="w-4 h-4 mr-2 text-jozi-gold" />
                    {c.products}
                  </div>
                </td>
                <td className="py-8">
                   <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                         <Calendar className="w-3 h-3 mr-2 opacity-40" />
                         Start: {c.start}
                      </div>
                      <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                         <Calendar className="w-3 h-3 mr-2 opacity-40" />
                         End: {c.end}
                      </div>
                   </div>
                </td>
                <td className="py-8 text-center font-black text-jozi-forest text-sm">
                  {c.budget}
                </td>
                <td className="py-8">
                  <Badge status={c.status} />
                </td>
                <td className="py-8 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-3 bg-white text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm transition-all border border-transparent hover:border-jozi-forest/10">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-white text-gray-400 rounded-xl hover:text-rose-500 shadow-sm transition-all border border-transparent hover:border-rose-100">
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button className="p-3 text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;