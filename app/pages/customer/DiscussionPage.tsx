
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, Plus, CheckCircle2, Clock, 
  AlertCircle, ThumbsUp, Reply, MoreVertical, Flag, EyeOff, 
  Pin, Share2, ImageIcon, Tag, User, Store, ShieldCheck,
  ChevronDown, ArrowUpRight, Sparkles, X, Send
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import Link from 'next/link';

// --- MOCK DATA ---
interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: 'Customer' | 'Vendor' | 'Admin';
  content: string;
  timestamp: string;
  likes: number;
  isVerified?: boolean;
  replies?: Comment[];
}

interface Thread {
  id: string;
  title: string;
  product?: string;
  vendor: string;
  category: 'Inquiry' | 'Feedback' | 'Issue';
  status: 'Open' | 'Resolved' | 'Pending Artisan';
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  replyCount: number;
  comments: Comment[];
  tags: string[];
}

const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    title: 'Sizing query for Shweshwe Evening Dress',
    product: 'Shweshwe Evening Dress',
    vendor: 'Maboneng Textiles',
    category: 'Inquiry',
    status: 'Resolved',
    author: 'Lerato Dlamini',
    avatar: 'https://i.pravatar.cc/150?u=lerato',
    timestamp: '2h ago',
    content: 'Hi! I am between a size 32 and 34. Does this dress have any stretch or should I size up for a comfortable fit at the waist?',
    likes: 12,
    replyCount: 2,
    tags: ['Sizing', 'Fashion'],
    comments: [
      {
        id: 'c1',
        author: 'Maboneng Textiles',
        avatar: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100',
        role: 'Vendor',
        isVerified: true,
        content: 'Hello Lerato! Our shweshwe is 100% cotton and does not stretch. We highly recommend sizing up to a 34 for the best silhouette.',
        timestamp: '1h ago',
        likes: 8
      },
      {
        id: 'c2',
        author: 'Lerato Dlamini',
        avatar: 'https://i.pravatar.cc/150?u=lerato',
        role: 'Customer',
        content: 'Thank you! Just ordered the 34.',
        timestamp: '45m ago',
        likes: 2
      }
    ]
  },
  {
    id: 't2',
    title: 'Delivery delay to Pretoria East',
    category: 'Issue',
    status: 'Pending Artisan',
    vendor: 'Rosebank Art Gallery',
    author: 'Kevin Naidoo',
    avatar: 'https://i.pravatar.cc/150?u=kevin',
    timestamp: '5h ago',
    content: 'My order #ORD-2041 has been in "Processing" for 4 days now. Any updates on when it will hit the Hub?',
    likes: 3,
    replyCount: 1,
    tags: ['Logistics', 'Delay'],
    comments: [
      {
        id: 'c3',
        author: 'Jozi Steward',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        role: 'Admin',
        content: 'Hi Kevin, we have nudged the artisan. The Hub courier is scheduled for a pickup tomorrow morning.',
        timestamp: '2h ago',
        likes: 5
      }
    ]
  }
];

const DiscussionPage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = filterCategory === 'All' || t.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [threads, searchQuery, filterCategory]);

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* Header Section */}
      <section className="bg-jozi-forest py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 relative z-10 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-jozi-gold text-[10px] font-black uppercase tracking-widest">
              Neighborhood Voice • Collective Wisdom
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Discussion <br /><span className="text-jozi-gold italic">Gallery.</span>
            </h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl font-medium leading-relaxed italic">
              Connect directly with artisans, resolve queries, and share your experiences with the Jozi collective.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Discovery Sidebar */}
          <aside className="lg:w-96 shrink-0 space-y-8 text-left">
            <div className="bg-white rounded-5xl p-8 shadow-soft border border-jozi-forest/5 space-y-8">
              <div className="space-y-4">
                 <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest flex items-center">
                    <Search className="w-4 h-4 mr-2 text-jozi-gold" /> Search Conversations
                 </h3>
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Artisan or product..."
                      className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Market Context</h3>
                 <div className="space-y-2">
                    {['All', 'Inquiry', 'Feedback', 'Issue'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`w-full flex items-center justify-between px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                          filterCategory === cat ? 'bg-jozi-forest text-white shadow-lg' : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
                        }`}
                      >
                        <span>{cat}</span>
                        {filterCategory === cat && <ChevronDown className="w-4 h-4" />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={() => setIsNewThreadModalOpen(true)}
                  className="w-full py-5 bg-jozi-gold text-jozi-dark rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-jozi-gold/20 hover:scale-[1.02] transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Start Discussion
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-jozi-dark p-8 rounded-5xl text-white space-y-6 relative overflow-hidden shadow-2xl group">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-3 text-jozi-gold">
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Community Pulse</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-3xl font-black">94%</p>
                      <p className="text-[9px] font-bold text-jozi-cream/40 uppercase tracking-widest mt-1">Resolution Rate</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black">2.4h</p>
                      <p className="text-[9px] font-bold text-jozi-cream/40 uppercase tracking-widest mt-1">Avg Response</p>
                    </div>
                  </div>
               </div>
               <MessageSquare className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:rotate-12 transition-transform duration-1000" />
            </div>
          </aside>

          {/* Discussion Feed */}
          <main className="grow space-y-6 text-left">
            <AnimatePresence mode="popLayout">
              {filteredThreads.map((thread) => (
                <motion.div 
                  key={thread.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-5xl shadow-soft border border-jozi-forest/5 overflow-hidden transition-all ${expandedThreadId === thread.id ? 'ring-2 ring-jozi-gold/20' : ''}`}
                >
                  {/* Thread Summary Header */}
                  <div className="p-8 lg:p-10 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedThreadId(expandedThreadId === thread.id ? null : thread.id)}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex items-start space-x-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-jozi-cream shadow-sm shrink-0">
                          <img src={thread.avatar} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex flex-wrap items-center gap-3">
                              <StatusBadge status={thread.status} />
                              <span className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em]">{thread.category}</span>
                              <div className="w-1 h-1 bg-gray-200 rounded-full" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{thread.timestamp}</span>
                           </div>
                           <h3 className="text-2xl font-black text-jozi-forest tracking-tight group-hover:text-jozi-gold transition-colors">{thread.title}</h3>
                           <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             <span>By {thread.author}</span>
                             <div className="w-1 h-1 bg-gray-200 rounded-full" />
                             <span>Target: {thread.vendor}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                         <div className="flex items-center space-x-1 text-gray-300">
                           <ThumbsUp className="w-4 h-4" />
                           <span className="text-xs font-bold">{thread.likes}</span>
                         </div>
                         <div className="flex items-center space-x-1 text-gray-300">
                           <MessageSquare className="w-4 h-4" />
                           <span className="text-xs font-bold">{thread.replyCount}</span>
                         </div>
                         <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-500 ${expandedThreadId === thread.id ? 'rotate-180 text-jozi-gold' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content & Replies */}
                  <AnimatePresence>
                    {expandedThreadId === thread.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50 overflow-hidden bg-gray-50/30"
                      >
                        <div className="p-8 lg:p-12 space-y-10">
                           {/* Original Post Body */}
                           <div className="space-y-6">
                              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                                "{thread.content}"
                              </p>
                              {thread.product && (
                                <Link href="#" className="inline-flex items-center bg-white border border-jozi-forest/10 p-3 rounded-2xl group hover:border-jozi-gold transition-all">
                                   <PackageIcon className="w-5 h-5 mr-3 text-jozi-gold" />
                                   <div className="text-left">
                                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Linked Artifact</p>
                                      <p className="text-xs font-black text-jozi-forest group-hover:text-jozi-gold">{thread.product}</p>
                                   </div>
                                </Link>
                              )}
                              <div className="flex flex-wrap gap-2">
                                 {thread.tags.map(tag => (
                                   <span key={tag} className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-gray-400 uppercase border border-gray-100">#{tag}</span>
                                 ))}
                              </div>
                           </div>

                           {/* Replies Area */}
                           <div className="space-y-6 pt-10 border-t border-gray-100">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">Collective Responses</h4>
                              <div className="space-y-6">
                                 {thread.comments.map((comment) => (
                                   <div key={comment.id} className={`flex items-start space-x-6 p-6 rounded-3xl transition-all ${comment.role === 'Vendor' ? 'bg-jozi-gold/5 border-2 border-jozi-gold/20' : 'bg-white border border-gray-100 shadow-sm'}`}>
                                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                        <img src={comment.avatar} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="grow space-y-2">
                                         <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                              <span className="font-black text-jozi-forest text-sm">{comment.author}</span>
                                              {comment.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                                comment.role === 'Vendor' ? 'bg-jozi-gold text-jozi-dark' : 
                                                comment.role === 'Admin' ? 'bg-jozi-forest text-white' : 
                                                'bg-gray-100 text-gray-400'
                                              }`}>{comment.role}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase">{comment.timestamp}</span>
                                         </div>
                                         <p className="text-sm text-gray-500 font-medium leading-relaxed">{comment.content}</p>
                                         <div className="flex items-center space-x-6 pt-2">
                                            <button className="flex items-center space-x-2 text-[10px] font-black text-gray-400 hover:text-jozi-gold uppercase transition-colors">
                                               <ThumbsUp className="w-3.5 h-3.5" />
                                               <span>Helpful ({comment.likes})</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-[10px] font-black text-gray-400 hover:text-jozi-gold uppercase transition-colors">
                                               <Reply className="w-3.5 h-3.5" />
                                               <span>Reply</span>
                                            </button>
                                            {/* Moderation Controls (Admin view mock) */}
                                            <div className="ml-auto flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                               <button className="p-1.5 text-gray-300 hover:text-rose-500"><Flag className="w-3.5 h-3.5" /></button>
                                               <button className="p-1.5 text-gray-300 hover:text-jozi-forest"><MoreVertical className="w-3.5 h-3.5" /></button>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                 ))}
                              </div>

                              {/* Input Box */}
                              <div className="mt-8 pt-8 border-t border-gray-100">
                                 <div className="bg-white rounded-3xl p-4 shadow-inner border border-gray-100">
                                    <textarea 
                                      rows={2}
                                      placeholder="Add your contribution to the collective..."
                                      className="w-full bg-transparent px-4 py-2 font-medium text-sm text-jozi-forest outline-none resize-none"
                                    />
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                       <div className="flex items-center space-x-2">
                                          <button className="p-2 text-gray-400 hover:text-jozi-gold transition-colors"><ImageIcon className="w-5 h-5" /></button>
                                          <button className="p-2 text-gray-400 hover:text-jozi-gold transition-colors"><Tag className="w-5 h-5" /></button>
                                       </div>
                                       <button className="bg-jozi-forest text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all flex items-center group">
                                          Dispatch <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredThreads.length === 0 && (
              <div className="py-32 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                   <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-jozi-forest uppercase">Quiet Skies</h3>
                   <p className="text-gray-400 font-medium italic">No discussions found matching your current filters.</p>
                </div>
                <button onClick={() => {setFilterCategory('All'); setSearchQuery('');}} className="text-jozi-gold font-black text-xs uppercase tracking-widest hover:underline">Clear Search Logic</button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* NEW THREAD MODAL */}
      <AnimatePresence>
        {isNewThreadModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewThreadModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[4rem] p-10 lg:p-12 w-full max-w-2xl shadow-2xl overflow-hidden text-left">
               <button onClick={() => setIsNewThreadModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
               
               <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">Initialize Topic</h3>
                    <p className="text-gray-400 font-medium italic">Broadcast your query or feedback to the workshop stewards.</p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsNewThreadModalOpen(false); }}>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Context Header</label>
                        <input type="text" placeholder="e.g. Sizing query for Zebu boots" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Class</label>
                          <select className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer">
                             <option>Inquiry</option>
                             <option>Feedback</option>
                             <option>Issue</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Target Artisan</label>
                          <select className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer">
                             <option>Maboneng Textiles</option>
                             <option>Soweto Gold</option>
                             <option>Jozi Apothecary</option>
                          </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Narrative Detail</label>
                        <textarea rows={4} placeholder="Detailed explanation of your topic..." className="w-full bg-gray-50 rounded-4xl px-8 py-6 font-medium text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none" />
                     </div>

                     <div className="p-6 bg-jozi-gold/5 rounded-3xl border border-jozi-gold/20 flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-jozi-gold shrink-0 mt-1" />
                        <p className="text-xs text-jozi-forest/70 font-medium leading-relaxed italic">Public discussions are monitored by Platform Stewards. Do not share personal bank details or addresses in this public gallery.</p>
                     </div>

                     <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsNewThreadModalOpen(false)} className="grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100">Abort</button>
                        <button type="submit" className="grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                           <Send className="w-4 h-4 mr-2" /> Dispatch Topic
                        </button>
                     </div>
                  </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PackageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

export default DiscussionPage;
