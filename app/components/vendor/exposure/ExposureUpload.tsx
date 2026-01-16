import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Instagram, 
  Facebook, 
  Youtube, 
  Send, 
  X, 
  Plus, 
  Info,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Tag,
  // Added ChevronRight to fix 'Cannot find name' error
  ChevronRight
} from 'lucide-react';
import SectionHeader from '../../SectionHeader';

const PLATFORMS = [
  { id: 'ig', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'fb', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'tt', label: 'TikTok', icon: Smartphone, color: 'text-jozi-dark' },
  { id: 'yt', label: 'YouTube Shorts', icon: Youtube, color: 'text-red-600' },
];

interface ExposureUploadProps {
  canPost: boolean;
  onComplete: () => void;
}

const ExposureUpload: React.FC<ExposureUploadProps> = ({ canPost, onComplete }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      onComplete();
    }, 2000);
  };

  if (!canPost) {
    return (
      <div className="bg-white p-12 rounded-[4rem] text-center space-y-6 shadow-soft border border-gray-100 text-left">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-jozi-forest uppercase">Limit Reached</h3>
          <p className="text-gray-400 font-medium italic">You've utilized your 5 post slots for this month. Upgrade to Pro for unlimited exposure slots.</p>
        </div>
        <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl">
          Upgrade Plan
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[4rem] text-center space-y-8 shadow-soft border border-emerald-100 text-left"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xl shadow-emerald-100">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Transmission <br />Logged!</h3>
          <p className="text-gray-400 font-medium italic max-w-md mx-auto">
            Your content has been dispatched to the Jozi Market Admin. You'll receive a notification once the posting schedule is finalized.
          </p>
        </div>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-jozi-dark transition-all"
        >
          Create Another Submission
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Forge Exposure" 
        sub="Dispatch your artisan visuals for broadcast on the main Jozi Market channels." 
        icon={Upload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSumbit} className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 space-y-10">
            {/* Platform Selection */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">1. Destination Hubs</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => togglePlatform(plat.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all ${
                      selectedPlatforms.includes(plat.id) 
                        ? 'border-jozi-forest bg-jozi-forest/5' 
                        : 'border-gray-50 hover:border-jozi-gold/20'
                    }`}
                  >
                    <plat.icon className={`w-8 h-8 mb-3 ${selectedPlatforms.includes(plat.id) ? plat.color : 'text-gray-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlatforms.includes(plat.id) ? 'text-jozi-forest' : 'text-gray-400'}`}>
                      {plat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">2. Visual Payload</h4>
              <div className="aspect-video rounded-[3rem] bg-jozi-cream border-4 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center p-12 text-center group hover:bg-jozi-gold/5 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-jozi-gold shadow-xl mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h5 className="font-black text-jozi-forest">Drop Asset Here</h5>
                <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-widest">Images or 4K Vertical Video</p>
              </div>
            </div>

            {/* Copywriting */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">3. Narrative Logic</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Proposed Caption</label>
                  <textarea 
                    rows={4} 
                    placeholder="Describe the craft, the heritage, and the feeling..." 
                    className="w-full bg-gray-50 rounded-[2rem] px-8 py-6 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Key Hashtags</label>
                  <div className="relative">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="#JoziMarket #Handcrafted #ProudlySA" 
                      className="w-full bg-gray-50 rounded-2xl pl-14 pr-6 py-4 font-bold text-sm text-jozi-forest outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUploading || selectedPlatforms.length === 0}
              className={`w-full py-6 rounded-3xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center group ${
                isUploading || selectedPlatforms.length === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-jozi-forest text-white shadow-jozi-forest/30 hover:bg-jozi-dark'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Request Exposure
                </>
              )}
            </button>
          </form>
        </div>

        <aside className="space-y-8">
          <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group shadow-2xl text-left">
            <h4 className="text-xl font-black tracking-tight uppercase border-b border-white/10 pb-6">Governance Rules</h4>
            <div className="space-y-6 relative z-10">
              {[
                { t: 'Monthly Quota', d: 'Maximum 5 submissions per month.' },
                { t: 'Admin Control', d: 'Final schedule and ad targeting is set by Jozi Market.' },
                { t: 'Quality Filter', d: 'Content must be 1080p+ and feature artisan work.' },
                { t: 'Engagement', d: 'Posts stay active for 90 days in the main feed.' },
              ].map((rule, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <CheckCircle2 className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-sm">{rule.t}</p>
                    <p className="text-xs text-jozi-cream/50 font-medium leading-relaxed mt-1">{rule.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Info className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          <div className="p-10 bg-white rounded-[3.5rem] shadow-soft border border-gray-100 text-left">
            <h4 className="text-sm font-black text-jozi-forest uppercase tracking-widest mb-6">Expert Advice</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
              "Videos showcasing the <span className="font-black text-jozi-dark">actual crafting process</span> tend to get 400% higher engagement than static product shots."
            </p>
            <div className="mt-8 p-4 bg-jozi-cream rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-jozi-gold">Strategy Deck</span>
              <button className="text-jozi-forest hover:text-jozi-gold transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExposureUpload;