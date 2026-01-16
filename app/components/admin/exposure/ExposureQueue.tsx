import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronRight, CheckCircle2, XCircle, 
  Instagram, Smartphone, Facebook, Youtube,
  MoreVertical, Eye, Calendar, Zap, AlertTriangle,
  ArrowUpRight, RefreshCw, Star, Info,
  TrendingUp, LayoutGrid, List
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';
import { ADMIN_SOCIAL_SUBMISSIONS, SocialSubmission } from '../../../utilities/adminSocialMockData';
import ExposureApprovalModal from './ExposureApprovalModal';

const ExposureQueue: React.FC = () => {
  const [submissions, setSubmissions] = useState<SocialSubmission[]>(ADMIN_SOCIAL_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState<SocialSubmission | null>(null);

  const getPlatformIcon = (id: string) => {
    switch (id) {
      case 'ig': return <Instagram className="w-3.5 h-3.5" />;
      case 'tt': return <Smartphone className="w-3.5 h-3.5" />;
      case 'fb': return <Facebook className="w-3.5 h-3.5" />;
      case 'yt': return <Youtube className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-jozi-gold bg-jozi-gold/10';
    if (score >= 50) return 'text-blue-500 bg-blue-50';
    return 'text-rose-500 bg-rose-50';
  };

  const filteredData = useMemo(() => {
    return submissions.filter(s => {
      const matchesSearch = s.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = activeFilter === 'All' || s.status === activeFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, activeFilter]);

  return (
    <div className="space-y-8 text-left">
      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        {/* Advanced Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search artisan or artifact..." 
              className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
             {['All', 'Pending', 'Scheduled', 'Approved', 'Rejected'].map(f => (
               <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f ? 'bg-jozi-forest text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-white'
                }`}
               >
                 {f}
               </button>
             ))}
             <div className="h-10 w-[1px] bg-gray-100 mx-2" />
             <button className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Dense Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Artisan & Tier</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Promoted Piece</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Channels</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">AI Score</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Lodged Date</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((post) => (
                <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-jozi-cream flex items-center justify-center font-black text-jozi-forest shadow-sm italic uppercase">
                         {post.vendor[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                           <p className="font-black text-jozi-dark text-sm leading-none">{post.vendor}</p>
                           {post.priority && <Star className="w-3 h-3 text-jozi-gold fill-current" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 inline-block ${
                          post.vendorPlan === 'Pro' ? 'text-jozi-gold' : 'text-gray-400'
                        }`}>{post.vendorPlan} Member</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="font-black text-jozi-forest text-sm">{post.product}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{post.contentType}</p>
                  </td>
                  <td className="py-8">
                    <div className="flex justify-center -space-x-1.5">
                       {post.platforms.map((p, i) => (
                         <div key={i} title={p} className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 shadow-sm hover:z-10 transition-transform hover:scale-110">
                           {getPlatformIcon(p)}
                         </div>
                       ))}
                    </div>
                  </td>
                  <td className="py-8 text-center">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg font-black text-xs ${getScoreColor(post.aiScore)} shadow-sm`}>
                       <Zap className="w-3 h-3 mr-1.5 fill-current" />
                       {post.aiScore}
                    </div>
                  </td>
                  <td className="py-8">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="py-8">
                     <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                       <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                       {post.submissionDate}
                     </div>
                  </td>
                  <td className="py-8 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button onClick={() => setSelectedPost(post)} className="p-3 bg-white text-gray-400 rounded-xl hover:text-jozi-forest transition-all shadow-sm border border-transparent hover:border-jozi-forest/10">
                         <Eye className="w-4 h-4" />
                       </button>
                       <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-dark transition-all">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="py-32 text-center space-y-6">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <Smartphone className="w-10 h-10" />
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-black text-jozi-forest uppercase">Clear Skies</h3>
                <p className="text-gray-400 font-medium italic">No artisan submissions found for this specific filter set.</p>
             </div>
             <button onClick={() => {setSearchQuery(''); setActiveFilter('All');}} className="text-jozi-gold font-black text-xs uppercase tracking-widest hover:underline">Reset Hub Filters</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <ExposureApprovalModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExposureQueue;