import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, CheckCircle2, XCircle, Clock, Zap, Target, Share2, 
  Smartphone, Instagram, Facebook, Youtube, Edit3, MessageSquare,
  ShieldCheck, AlertCircle, Calendar, ChevronRight, Eye, MoreHorizontal,
  Play, Volume2, Info, ArrowUpRight, TrendingUp
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';
import { SocialSubmission } from '../../../utilities/adminSocialMockData';

interface ExposureApprovalModalProps {
  post: SocialSubmission;
  onClose: () => void;
}

const ExposureApprovalModal: React.FC<ExposureApprovalModalProps> = ({ post, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [slot, setSlot] = useState('18:00');
  const [internalScore, setInternalScore] = useState(post.aiScore);

  const handleAction = (type: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Asset ${type} and scheduled for ${slot} SAST.`);
      onClose();
    }, 1200);
  };

  const getPlatformIcon = (id: string) => {
    switch (id) {
      case 'ig': return <Instagram className="w-4 h-4" />;
      case 'fb': return <Facebook className="w-4 h-4" />;
      case 'tt': return <Smartphone className="w-4 h-4" />;
      case 'yt': return <Youtube className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-jozi-dark/80 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, x: 50 }} 
        animate={{ scale: 1, opacity: 1, x: 0 }} 
        exit={{ scale: 0.9, opacity: 0, x: 50 }}
        className="relative bg-white w-full max-w-7xl h-full lg:h-auto lg:max-h-[92vh] rounded-[3rem] lg:rounded-[4rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden text-left"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all hidden lg:flex">
          <X className="w-6 h-6" />
        </button>

        {/* Left Section: Contextual Preview */}
        <div className="lg:w-[450px] bg-jozi-dark relative shrink-0 overflow-hidden flex flex-col justify-center items-center p-8 md:p-12">
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img src={post.mediaUrl} className="w-full h-full object-cover blur-3xl scale-125" />
           </div>
           
           <div className="relative w-full aspect-[9/16] bg-black rounded-[3.5rem] border-[10px] border-white/10 overflow-hidden shadow-2xl flex flex-col group">
              <img src={post.mediaUrl} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-8 left-6 right-6 flex items-center justify-between text-white">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl border-2 border-jozi-gold overflow-hidden bg-jozi-forest flex items-center justify-center font-black italic">
                       {post.vendor[0]}
                    </div>
                    <div className="min-w-0">
                       <span className="text-[10px] font-black uppercase tracking-widest block truncate">{post.vendor}</span>
                       <span className="text-[8px] font-bold text-jozi-gold uppercase tracking-[0.2em]">{post.vendorPlan} Level</span>
                    </div>
                 </div>
                 <Share2 className="w-5 h-5 text-white/40" />
              </div>

              <div className="absolute bottom-12 left-8 right-8 text-white space-y-4">
                 <div className="flex space-x-2">
                    {post.platforms.map((p) => (
                      <div key={p} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-jozi-gold">{getPlatformIcon(p)}</div>
                    ))}
                 </div>
                 <p className="text-sm font-medium leading-relaxed line-clamp-4">
                    {post.caption}
                 </p>
                 <div className="flex items-center space-x-2 pt-4">
                    <div className="h-0.5 flex-grow bg-white/20 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        className="h-full bg-jozi-gold" 
                       />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">0:12 / 0:60</span>
                 </div>
              </div>
           </div>
           
           <div className="relative z-10 mt-8 flex space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl text-white/40">
                 <Volume2 className="w-4 h-4" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Original Audio</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-[9px] font-black uppercase tracking-widest">4K Asset Verified</span>
              </div>
           </div>
        </div>

        {/* Right Section: Orchestration Controls */}
        <div className="flex-grow overflow-y-auto p-10 lg:p-16 space-y-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
              <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                    <StatusBadge status={post.status} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Manifest Reference: {post.id}</span>
                 </div>
                 {/* FIX: Changed post.title to post.product as 'title' does not exist on type 'SocialSubmission' */}
                 <h2 className="text-4xl lg:text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">{post.product}</h2>
                 <p className="text-gray-400 font-medium italic">{post.contentType} Showcase • {post.vendor}</p>
              </div>

              <div className="bg-jozi-cream rounded-[2rem] px-8 py-5 border border-jozi-forest/5 flex items-center space-x-6">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vibrancy Score</p>
                    <p className={`text-3xl font-black ${post.aiScore >= 85 ? 'text-emerald-600' : 'text-jozi-gold'}`}>{post.aiScore}</p>
                 </div>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${post.aiScore >= 85 ? 'bg-jozi-forest' : 'bg-jozi-gold'}`}>
                    <Zap className="w-6 h-6 fill-current" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Submission Metadata */}
              <div className="space-y-10">
                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Narrative Guard</h3>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group">
                       <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{post.caption}"</p>
                       <button className="absolute top-4 right-4 p-2 bg-white rounded-lg text-gray-300 hover:text-jozi-gold transition-all shadow-sm">
                          <Edit3 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Broadcast Distribution</h3>
                    <div className="flex flex-wrap gap-3">
                       {['ig', 'tt', 'fb', 'yt'].map((p) => (
                         <div key={p} className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 transition-all ${post.platforms.includes(p) ? 'border-jozi-forest bg-jozi-forest text-white shadow-lg' : 'border-gray-50 bg-gray-50/50 text-gray-300'}`}>
                            {getPlatformIcon(p)}
                            <span className="text-[10px] font-black uppercase tracking-widest">{p === 'ig' ? 'Instagram' : p === 'tt' ? 'TikTok' : p === 'fb' ? 'Facebook' : 'YouTube'}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Administrative Actions */}
              <div className="space-y-10">
                 <div className="space-y-6">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Strategic Slot</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Launch Date</label>
                          <div className="relative">
                             <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                             <input type="date" defaultValue="2024-10-20" className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm text-jozi-forest outline-none" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Daily Slot</label>
                          <div className="relative">
                             <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                             <select 
                              value={slot} 
                              onChange={(e) => setSlot(e.target.value)}
                              className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm text-jozi-forest outline-none appearance-none cursor-pointer"
                             >
                                <option>09:00 (Morning Peak)</option>
                                <option>13:00 (Lunch Pulse)</option>
                                <option>18:00 (Evening Prime)</option>
                                <option>21:00 (Late Seeker)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Exposure Equity Adjustment</h3>
                    <div className="p-8 bg-jozi-dark rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                       <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                             <span>Boost Priority</span>
                             <span>Plan Guaranteed: YES</span>
                          </div>
                          <p className="text-sm text-jozi-cream/60 leading-relaxed font-medium">This vendor has 3 "Super Boosts" remaining this cycle. Activating boost will push this asset to the top of the next algorithmic cycle.</p>
                          <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">Enable Super Boost</button>
                       </div>
                       <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Feedback Loop */}
           <div className="space-y-4 pt-10 border-t border-gray-100">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Administrative Context</h3>
                 <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Quality Compliance Passed</span>
              </div>
              <textarea 
                rows={3} 
                placeholder="Add internal notes or feedback for the artisan workshop..." 
                className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-[2rem] px-8 py-6 font-medium text-sm text-jozi-forest outline-none transition-all resize-none"
              />
           </div>

           {/* Action Bar */}
           <div className="pt-10 flex flex-col md:flex-row gap-4 justify-end">
              <button 
                onClick={() => handleAction('Rejected')}
                className="px-10 py-5 bg-white text-rose-500 border-2 border-rose-100 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center"
              >
                 <XCircle className="w-5 h-5 mr-2" /> Decommission
              </button>
              <button 
                onClick={() => handleAction('Approved')}
                disabled={isProcessing}
                className={`px-12 py-5 bg-jozi-forest text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center min-w-[240px] ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
              >
                 {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                    <CheckCircle2 className="w-5 h-5 mr-3 text-jozi-gold" /> Confirm & Activate
                   </>
                 )}
              </button>
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

export default ExposureApprovalModal;