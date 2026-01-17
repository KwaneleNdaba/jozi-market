import React from 'react';
import { motion } from 'framer-motion';
import { 
  Store, Package, Calendar, Eye, ThumbsUp, 
  ArrowUpRight, MessageSquare, Upload, CheckCircle2 
} from 'lucide-react';
import Badge from './Badge';

interface CampaignCardProps {
  campaign: any;
  detailed?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, detailed = false }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-4xl p-8 border border-jozi-forest/5 shadow-soft hover:shadow-xl transition-all group text-left ${detailed ? 'h-full flex flex-col justify-between' : ''}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-jozi-cream rounded-xl flex items-center justify-center text-jozi-forest shadow-sm">
                <Store className="w-6 h-6 opacity-40" />
              </div>
              <div>
                <h4 className="font-black text-jozi-forest text-sm uppercase tracking-tight">{campaign.vendor}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Ref: {campaign.id}</p>
              </div>
           </div>
           <Badge status={campaign.status} />
        </div>

        <div className="space-y-4">
           <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-jozi-gold shrink-0 mt-0.5" />
              <p className="font-bold text-jozi-dark text-sm leading-relaxed">{campaign.products}</p>
           </div>
           <div className="flex items-center space-x-3 text-gray-400">
              <Calendar className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest">{campaign.duration}</span>
           </div>
        </div>

        {detailed && (
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
             <div className="space-y-1">
                <div className="flex items-center space-x-2 text-gray-300">
                   <Eye className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Views</span>
                </div>
                <p className="text-xl font-black text-jozi-forest">{campaign.metrics.views}</p>
             </div>
             <div className="space-y-1">
                <div className="flex items-center space-x-2 text-gray-300">
                   <ThumbsUp className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Engage</span>
                </div>
                <p className="text-xl font-black text-jozi-forest">{campaign.metrics.likes}</p>
             </div>
             <div className="col-span-2 pt-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-jozi-gold mb-1">Generated Revenue</p>
                <p className="text-2xl font-black text-jozi-dark">{campaign.revenue}</p>
             </div>
          </div>
        )}
      </div>

      <div className={`flex items-center gap-3 ${detailed ? 'mt-8' : 'pt-6 border-t border-gray-50 mt-6'}`}>
         {campaign.status === 'Active' ? (
           <>
              <button className="grow py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/10 flex items-center justify-center">
                 <Upload className="w-4 h-4 mr-2 text-jozi-gold" /> Upload Proof
              </button>
              <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-colors shadow-sm">
                 <MessageSquare className="w-4 h-4" />
              </button>
           </>
         ) : campaign.status === 'Pending' ? (
           <>
              <button className="grow py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center">
                 <CheckCircle2 className="w-4 h-4 mr-2" /> Accept Collab
              </button>
              <button className="px-6 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                 Review Offer
              </button>
           </>
         ) : (
           <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center cursor-default">
              <ArrowUpRight className="w-4 h-4 mr-2" /> View Archive
           </button>
         )}
      </div>
    </motion.div>
  );
};

export default CampaignCard;