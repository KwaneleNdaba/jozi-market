import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, CheckCircle2, XCircle, Instagram, Smartphone, 
  Facebook, Youtube, Package, Calendar, MoreVertical, Store, User
} from 'lucide-react';
import Badge from '../../influencer/Badge';

interface CampaignApprovalTableProps {
  campaigns: any[];
  onView: (campaign: any) => void;
  onQuickApprove: (id: string) => void;
}

const CampaignApprovalTable: React.FC<CampaignApprovalTableProps> = ({ campaigns, onView, onQuickApprove }) => {
  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Instagram': return <Instagram className="w-3.5 h-3.5" />;
      case 'TikTok': return <Smartphone className="w-3.5 h-3.5" />;
      case 'Facebook': return <Facebook className="w-3.5 h-3.5" />;
      case 'YouTube': return <Youtube className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto text-left">
      <table className="w-full text-left min-w-[1000px]">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Workshop & Creator</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Promotion Logic</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Timeline</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Channels</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Commercials</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
            <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {campaigns.map((c) => (
            <tr key={c.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="py-6">
                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm z-10 bg-jozi-cream">
                      <img src={c.vendorLogo} className="w-full h-full object-cover" alt="Vendor" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm z-0 bg-jozi-forest">
                      <img src={c.influencerAvatar} className="w-full h-full object-cover" alt="Influencer" />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-jozi-dark text-sm leading-tight">{c.vendor}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">& {c.influencer}</p>
                  </div>
                </div>
              </td>
              <td className="py-6">
                <div className="flex items-center text-jozi-forest font-bold text-xs">
                  <Package className="w-4 h-4 mr-2 text-jozi-gold" />
                  {c.products}
                </div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Type: {c.type}</p>
              </td>
              <td className="py-6">
                <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                  {c.duration}
                </div>
              </td>
              <td className="py-6">
                <div className="flex justify-center -space-x-2">
                  {c.platforms.map((p: any, i: number) => (
                    <div key={i} title={p} className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm hover:z-10 transition-transform hover:scale-110">
                      {getPlatformIcon(p)}
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-6 text-center">
                <p className="font-black text-jozi-dark text-sm">{c.budget}</p>
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">{c.commission} Comm.</p>
              </td>
              <td className="py-6">
                <Badge status={c.status} />
              </td>
              <td className="py-6 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => onView(c)}
                    className="p-3 bg-white text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm border border-transparent hover:border-jozi-forest/10"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {c.status === 'Pending' && (
                    <button 
                      onClick={() => onQuickApprove(c.id)}
                      className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-3 text-gray-300">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignApprovalTable;