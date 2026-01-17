import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, CheckCircle2, XCircle, Clock, ShieldCheck, 
  MessageSquare, Layout, Package, Users, Store, 
  ArrowUpRight, AlertCircle, Calendar, Smartphone, 
  Instagram, Facebook, Youtube, Play, Info
} from 'lucide-react';
import Badge from '../../influencer/Badge';

interface CampaignApprovalModalProps {
  campaign: any;
  onClose: () => void;
  onAction: (id: string, status: string) => void;
}

const CampaignApprovalModal: React.FC<CampaignApprovalModalProps> = ({ campaign, onClose, onAction }) => {
  const [adminComment, setAdminComment] = useState('');

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'TikTok': return <Smartphone className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'YouTube': return <Youtube className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, x: 50 }} 
        animate={{ scale: 1, opacity: 1, x: 0 }} 
        exit={{ scale: 0.9, opacity: 0, x: 50 }}
        className="relative bg-white w-full max-w-6xl h-full lg:h-auto lg:max-h-[90vh] rounded-5xl lg:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="bg-jozi-forest p-10 lg:p-12 text-white relative shrink-0">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <MegaphoneIcon className="w-48 h-48" />
           </div>
           <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
             <X className="w-6 h-6" />
           </button>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                    <Badge status={campaign.status} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Review Phase 1 • Submission ID: {campaign.id}</span>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">{campaign.title}</h2>
                 <div className="flex items-center space-x-4 text-jozi-cream/60 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2" /> Logged {campaign.submissionDate}</div>
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="flex items-center text-jozi-gold"><ShieldCheck className="w-3.5 h-3.5 mr-2" /> Contract Pending</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="grow overflow-y-auto p-10 lg:p-16 space-y-16">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left: Profiles & Matchmaking */}
              <div className="lg:col-span-7 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vendor Profile */}
                    <div className="bg-gray-50 p-8 rounded-5xl border border-gray-100 space-y-6 text-left relative overflow-hidden group">
                       <div className="relative z-10 flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                             <img src={campaign.vendorLogo} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest mb-1">The Workshop</p>
                             <h4 className="text-lg font-black text-jozi-forest uppercase leading-none">{campaign.vendor}</h4>
                          </div>
                       </div>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 italic">"{campaign.vendorDescription}"</p>
                       <div className="flex items-center space-x-2 text-[10px] font-black text-jozi-forest uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Verified Artisan</span>
                       </div>
                       <Store className="absolute -bottom-6 -right-6 w-24 h-24 opacity-5" />
                    </div>

                    {/* Influencer Profile */}
                    <div className="bg-jozi-dark p-8 rounded-5xl text-white space-y-6 text-left relative overflow-hidden group shadow-xl">
                       <div className="relative z-10 flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg">
                             <img src={campaign.influencerAvatar} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest mb-1">The Creator</p>
                             <h4 className="text-lg font-black uppercase leading-none">{campaign.influencer}</h4>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl">
                             <p className="text-[8px] font-black uppercase text-white/40">Audience</p>
                             <p className="text-xl font-black text-jozi-gold leading-none mt-1">{campaign.influencerStats.reach}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl">
                             <p className="text-[8px] font-black uppercase text-white/40">Engagement</p>
                             <p className="text-xl font-black text-white leading-none mt-1">{campaign.influencerStats.engage}</p>
                          </div>
                       </div>
                       <Users className="absolute -bottom-6 -right-6 w-24 h-24 opacity-5" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight flex items-center">
                       <Package className="w-5 h-5 mr-3 text-jozi-gold" /> Promotion Payload
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-jozi-cream/30 rounded-5xl border border-jozi-forest/5 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Featured Piece(s)</p>
                            <h4 className="text-lg font-black text-jozi-forest leading-tight mb-2">{campaign.products}</h4>
                            <p className="text-sm text-gray-500 font-medium">Bespoke artifacts from the current workshop cycle.</p>
                          </div>
                          <button className="mt-8 text-[10px] font-black text-jozi-gold uppercase hover:underline flex items-center">
                             Audit Inventory Registry <ArrowUpRight className="w-3 h-3 ml-1" />
                          </button>
                       </div>
                       <div className="bg-gray-50 rounded-5xl overflow-hidden relative group aspect-video">
                          <img src={campaign.mediaUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-jozi-forest shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-1" />
                             </button>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                             Visual Draft
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight flex items-center">
                       <MessageSquare className="w-5 h-5 mr-3 text-jozi-gold" /> Creator Directives
                    </h3>
                    <div className="p-8 bg-gray-50 rounded-5xl border border-gray-100 text-sm font-medium text-gray-500 leading-relaxed italic">
                       "{campaign.notes}"
                    </div>
                 </div>
              </div>

              {/* Right: Commercials & Actions */}
              <div className="lg:col-span-5 space-y-12">
                 <div className="bg-white rounded-5xl border border-gray-100 p-10 space-y-10 shadow-soft text-left">
                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight border-b border-gray-100 pb-6">Commercial Audit</h3>
                       
                       <div className="space-y-6">
                          <div className="flex justify-between items-center">
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Campaign Budget</p>
                                <p className="text-3xl font-black text-jozi-forest tracking-tighter">{campaign.budget}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee Structure</p>
                                <p className="text-xl font-black text-emerald-500">{campaign.commission} commission</p>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Approved Channels</p>
                             <div className="flex gap-2">
                                {campaign.platforms.map((plat: string) => (
                                  <div key={plat} className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                                     {getPlatformIcon(plat)}
                                     <span className="text-[9px] font-black uppercase tracking-widest">{plat}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-gray-100">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Administrative Feedback</label>
                       <textarea 
                        rows={4}
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder="Add internal notes or feedback for the vendor..."
                        className="w-full bg-gray-50 rounded-3xl p-6 text-sm font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none"
                       />
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                       <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] text-blue-800 font-medium leading-relaxed italic">"Approval will trigger the Escrow Protocol and lock {campaign.budget} for this collaboration."</p>
                    </div>
                 </div>

                 {/* Action Panel */}
                 <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => onAction(campaign.id, 'Approved')}
                      className="w-full py-6 bg-jozi-forest text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center group"
                    >
                       <CheckCircle2 className="w-5 h-5 mr-3 text-jozi-gold group-hover:scale-110 transition-transform" /> Confirm & Activate
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                        onClick={() => onAction(campaign.id, 'Rejected')}
                        className="py-5 bg-white border-2 border-rose-100 text-rose-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center"
                       >
                          <XCircle className="w-4 h-4 mr-2" /> Decommission
                       </button>
                       <button 
                        onClick={() => alert('Change request dispatched.')}
                        className="py-5 bg-white border-2 border-jozi-forest/10 text-jozi-forest rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-cream transition-all flex items-center justify-center"
                       >
                          <Edit3Icon className="w-4 h-4 mr-2" /> Request Edits
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal icon for better aesthetic
const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 13v-2Z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const Edit3Icon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export default CampaignApprovalModal;