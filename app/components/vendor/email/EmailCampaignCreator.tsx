import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Calendar, 
  Sparkles, 
  Wand2, 
  Layout, 
  Eye, 
  Tag, 
  Package, 
  CheckCircle2, 
  X,
  Smartphone,
  Monitor,
  ChevronRight,
  Info,
  ChevronLeft,
  Search,
  Plus,
  // Added missing Users icon
  Users
} from 'lucide-react';
import SectionHeader from '../../SectionHeader';
import StatusBadge from '../../StatusBadge';

// Moved ZapIcon definition above TEMPLATES to fix block-scoped variable usage error
const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// Moved BookIcon definition above TEMPLATES to fix block-scoped variable usage error
const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TEMPLATES = [
  { id: 't1', name: 'Artisan Drop', desc: 'Focus on a single hero piece with high-res imagery.', icon: Package },
  { id: 't2', name: 'Flash Sale', desc: 'Urgency-driven layout with countdown logic.', icon: ZapIcon },
  { id: 't3', name: 'Neighborhood Update', desc: 'Storytelling focus for building brand loyalty.', icon: BookIcon },
];

interface EmailCampaignCreatorProps {
  onLaunch: () => void;
}

const EmailCampaignCreator: React.FC<EmailCampaignCreatorProps> = ({ onLaunch }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('t1');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleLaunch = () => {
    alert('Campaign Dispatched to Fulfillment Queue!');
    onLaunch();
  };

  return (
    <div className="space-y-10 text-left">
      <SectionHeader 
        title="Forge New Campaign" 
        sub="Compose artisanal broadcasts with AI-powered logic and behavior-driven targeting." 
        icon={Plus}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Stepper Sidebar */}
        <div className="xl:col-span-1 space-y-4">
           {[
             { id: 1, label: 'Framework', icon: Layout, desc: 'Template & Goal' },
             { id: 2, label: 'Compose', icon: Wand2, desc: 'Copy & Narrative' },
             { id: 3, label: 'Payload', icon: Package, desc: 'Product Assets' },
             { id: 4, label: 'Logistics', icon: Calendar, desc: 'Timing & Segment' },
           ].map((s) => (
             <div 
              key={s.id}
              className={`p-6 rounded-[2rem] border-2 transition-all flex items-center space-x-5 ${
                step === s.id ? 'bg-white border-jozi-gold shadow-lg' : 
                step > s.id ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-gray-50 opacity-40'
              }`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  step === s.id ? 'bg-jozi-gold text-jozi-dark' : 
                  step > s.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                   {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <div>
                   <p className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-jozi-gold' : 'text-gray-400'}`}>Step {s.id}</p>
                   <p className="font-black text-jozi-forest text-sm leading-tight">{s.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Main Composer Area */}
        <div className="xl:col-span-3 space-y-8">
          <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Campaign Framework</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                            selectedTemplate === t.id 
                              ? 'border-jozi-forest bg-jozi-forest/5' 
                              : 'border-gray-50 bg-white hover:border-jozi-gold/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedTemplate === t.id ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <t.icon className="w-5 h-5" />
                          </div>
                          <h5 className="font-black text-sm text-jozi-forest">{t.name}</h5>
                          <p className="text-[10px] text-gray-400 font-medium mt-2 leading-relaxed">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">The Artisan Narrative</h3>
                       <button 
                        onClick={() => setIsGenerating(true)}
                        className="bg-jozi-gold/10 text-jozi-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-jozi-gold hover:text-white transition-all"
                       >
                          <Sparkles className="w-4 h-4 mr-2" /> AI Generate Body
                       </button>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Subject Line</label>
                          <div className="relative">
                            <input type="text" placeholder="Discover the soul of our new collection..." className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-jozi-gold hover:scale-110 transition-transform">
                               <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                       </div>
                       <div className="space-y-2 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Body</label>
                          <div className="bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus-within:border-jozi-gold/20 transition-all overflow-hidden">
                             <div className="flex items-center space-x-4 px-6 py-3 border-b border-gray-100 bg-white/50">
                                <button className="p-1 font-black text-xs hover:text-jozi-gold">B</button>
                                <button className="p-1 italic text-xs hover:text-jozi-gold">I</button>
                                <button className="p-1 underline text-xs hover:text-jozi-gold">U</button>
                                <div className="h-4 w-[1px] bg-gray-200" />
                                <button className="p-1 hover:text-jozi-gold"><Layout className="w-3.5 h-3.5" /></button>
                             </div>
                             <textarea rows={8} placeholder="Tell your artisans story..." className="w-full bg-transparent px-8 py-6 font-medium text-sm text-jozi-forest outline-none resize-none" />
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" className="space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Campaign Payload</h3>
                      <div className="flex space-x-2">
                        <button className="bg-jozi-forest/5 text-jozi-forest px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-jozi-forest hover:text-white transition-all">
                           <Plus className="w-4 h-4 mr-2" /> Add Product
                        </button>
                        <button className="bg-jozi-gold/10 text-jozi-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-jozi-gold hover:text-white transition-all">
                           <Tag className="w-4 h-4 mr-2" /> Attach Voucher
                        </button>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-jozi-cream/30 rounded-[2rem] border-2 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center text-center group hover:bg-white transition-all cursor-pointer min-h-[150px]">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-jozi-gold shadow-sm group-hover:scale-110 transition-transform mb-3">
                            <Plus className="w-5 h-5" />
                         </div>
                         <p className="text-[10px] font-black uppercase text-gray-400">Select Gallery Pieces</p>
                      </div>
                      <div className="p-6 bg-jozi-cream/30 rounded-[2rem] border-2 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center text-center group hover:bg-white transition-all cursor-pointer min-h-[150px]">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-jozi-gold shadow-sm group-hover:scale-110 transition-transform mb-3">
                            <Plus className="w-5 h-5" />
                         </div>
                         <p className="text-[10px] font-black uppercase text-gray-400">Select Active Vouchers</p>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" className="space-y-10 text-left">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Execution Logic</h3>
                      <p className="text-gray-400 font-medium italic">Targeting specific neighbor segments for maximum yield.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Segment</label>
                         <select className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none">
                            <option>Loyal Neighbors (3+ Orders)</option>
                            <option>New Seekers (Last 30 Days)</option>
                            <option>Dormant Neighbors (No orders 6mo)</option>
                            <option>Custom Segment (442 Users)</option>
                         </select>
                         <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3 text-blue-600">
                            <Users className="w-5 h-5" />
                            <span className="text-xs font-bold">Reaching 2,450 Neighbors</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dispatch Schedule</label>
                         <div className="flex gap-2">
                            <button className="flex-grow py-4 bg-jozi-forest text-white rounded-xl font-black text-xs uppercase tracking-widest">Send Now</button>
                            <button className="flex-grow py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest">Future Date</button>
                         </div>
                         <div className="relative opacity-40">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" />
                            <input type="date" disabled className="w-full bg-gray-50 rounded-2xl px-6 pl-12 py-4 font-bold text-jozi-forest" />
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Footer Navigation */}
            <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-between">
               <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`flex items-center space-x-2 font-black text-sm uppercase tracking-widest transition-all ${
                  step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-jozi-forest'
                }`}
               >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous Step</span>
               </button>

               <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-8 py-5 bg-white border border-jozi-forest/10 text-jozi-forest rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-cream transition-all flex items-center"
                 >
                    <Eye className="w-4 h-4 mr-2" /> Live Preview
                 </button>
                 <button 
                  onClick={() => step < 4 ? setStep(step + 1) : handleLaunch()}
                  className="bg-jozi-forest text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center shadow-2xl shadow-jozi-forest/20 hover:scale-105 transition-all group"
                 >
                    {step === 4 ? 'Deploy Campaign' : 'Continue'}
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-jozi-dark/70 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-jozi-cream w-full max-w-4xl h-full lg:h-auto lg:max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col text-left"
            >
              {/* Preview Controls */}
              <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-3 rounded-xl transition-all ${previewMode === 'mobile' ? 'bg-jozi-forest text-white' : 'bg-gray-50 text-gray-400'}`}
                    >
                       <Smartphone className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-3 rounded-xl transition-all ${previewMode === 'desktop' ? 'bg-jozi-forest text-white' : 'bg-gray-50 text-gray-400'}`}
                    >
                       <Monitor className="w-5 h-5" />
                    </button>
                 </div>
                 <button onClick={() => setIsPreviewOpen(false)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Preview Body */}
              <div className="flex-grow overflow-y-auto p-8 flex justify-center items-start">
                 <div className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden ${previewMode === 'mobile' ? 'w-[375px] rounded-[3rem]' : 'w-full rounded-[1.5rem]'}`}>
                    <div className="bg-jozi-forest p-10 text-center">
                       <h1 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">Jozi Market</h1>
                       <p className="text-jozi-gold text-[10px] font-black uppercase tracking-widest mt-2">Artisan Exclusive</p>
                    </div>
                    <div className="p-10 space-y-8">
                       <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden relative">
                          <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                       </div>
                       <div className="space-y-4">
                          <h2 className="text-3xl font-black text-jozi-forest tracking-tighter leading-tight">The Soul of the Hub.</h2>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Discover our latest shweshwe collection, hand-stitched in Maboneng. Use code <span className="font-bold text-jozi-gold">HERITAGE24</span> for 15% off.
                          </p>
                       </div>
                       <button className="w-full py-5 bg-jozi-forest text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">
                          Explore Collection
                       </button>
                       <div className="pt-10 border-t border-gray-100 text-center">
                          <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">Jozi Market • 144 Fox St • Johannesburg</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailCampaignCreator;