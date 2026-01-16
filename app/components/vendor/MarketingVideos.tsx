import React from 'react';
import { motion } from 'framer-motion';
// Added missing Trash2 to imports
import { Video, Play, Eye, ThumbsUp, Share2, Plus, Sparkles, Wand2, ArrowUpRight, Trash2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';

const MOCK_VIDEOS = [
  { id: 'v1', title: 'The Indigo Process', status: 'Active', views: '12.4k', engagement: '8.2%', duration: '0:15', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400' },
  { id: 'v2', title: 'Fitting Room Vibes', status: 'Draft', views: '0', engagement: '0%', duration: '0:22', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400' },
  { id: 'v3', title: 'Crafting Heritage', status: 'Active', views: '4.8k', engagement: '12.5%', duration: '0:45', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400' },
];

const MarketingVideos: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Social Cinema" 
        sub="Upload and track vertical storytelling assets that drive high-intent market traffic." 
        icon={Video}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Upload Card */}
        <button className="rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 text-center group hover:border-jozi-gold/20 transition-all min-h-[400px]">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
             <Plus className="w-8 h-8" />
           </div>
           <h4 className="text-xl font-black text-gray-300 group-hover:text-jozi-forest transition-colors">New Reel</h4>
           <p className="text-xs text-gray-300 font-bold mt-2">Max 60s Vertical MP4</p>
        </button>

        {/* Video Cards */}
        {MOCK_VIDEOS.map((video, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={video.id}
            className="bg-white rounded-[3rem] overflow-hidden shadow-soft border border-gray-100 group relative flex flex-col"
          >
            <div className="relative aspect-[9/16] overflow-hidden bg-jozi-dark">
               <img src={video.img} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                     <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
               </div>
               <div className="absolute top-6 left-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 ${
                    video.status === 'Active' ? 'bg-emerald-500 border-white text-white' : 'bg-white border-white text-jozi-dark'
                  }`}>
                    {video.status}
                  </span>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                  <h5 className="text-lg font-black text-white leading-tight">{video.title}</h5>
                  <div className="flex items-center space-x-4 mt-3 text-white/70 text-[10px] font-bold">
                    <div className="flex items-center space-x-1">
                       <Eye className="w-3 h-3" />
                       <span>{video.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                       <ThumbsUp className="w-3 h-3" />
                       <span>{video.engagement}</span>
                    </div>
                  </div>
               </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{video.duration}</span>
               <div className="flex space-x-1">
                  <button className="p-2 text-gray-300 hover:text-jozi-forest"><Share2 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Content Engine Sidebar */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-jozi-forest/5 flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
         <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center bg-jozi-forest/5 text-jozi-forest px-4 py-2 rounded-full">
               <Sparkles className="w-4 h-4 mr-2" />
               <span className="text-[10px] font-black uppercase tracking-widest">AI Copywriter Active</span>
            </div>
            <h3 className="text-3xl font-black text-jozi-forest leading-none uppercase">Need a Catchy <br /><span className="text-jozi-gold">Reel Script?</span></h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed italic">"Our AI detected that your blue shweshwe collection is trending in Pretoria East. Click generate for a 15s script tailored for local high-engagement."</p>
         </div>
         <button className="bg-jozi-dark text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl flex items-center group">
            <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Generate Narrative
         </button>
      </div>
    </div>
  );
};

export default MarketingVideos;