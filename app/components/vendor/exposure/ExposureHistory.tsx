import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Instagram, 
  Facebook, 
  Smartphone, 
  Youtube, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MoreVertical,
  Calendar,
  MessageSquare
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';
import SectionHeader from '../../SectionHeader';

const MOCK_HISTORY = [
  { id: 's1', title: 'Spring Collection Reel', date: 'Oct 12, 2024', status: 'Approved', platforms: ['ig', 'tt'], feedback: 'Great lighting, scheduled for Oct 18th.' },
  { id: 's2', title: 'Workshop Behind the Scenes', date: 'Oct 08, 2024', status: 'Pending', platforms: ['ig', 'fb'], feedback: '' },
  { id: 's3', title: 'Heritage Dress Close-up', date: 'Sep 25, 2024', status: 'Rejected', platforms: ['yt'], feedback: 'Image resolution too low. Please re-upload 4K asset.' },
  { id: 's4', title: 'Customer Unboxing (Lerato)', date: 'Sep 12, 2024', status: 'Approved', platforms: ['tt', 'ig', 'fb'], feedback: 'Excellent authentic testimonial.' },
];

const ExposureHistory: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ig': return <Instagram className="w-3.5 h-3.5" />;
      case 'fb': return <Facebook className="w-3.5 h-3.5" />;
      case 'tt': return <Smartphone className="w-3.5 h-3.5" />;
      case 'yt': return <Youtube className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Submission Logs" 
        sub="Track the lifecycle of your social media requests from draft to broadcast." 
        icon={History}
      />

      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Post Payload</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Channels</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Lodged Date</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Gov. Status</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Admin Logic</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_HISTORY.map((item, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-jozi-cream rounded-xl flex items-center justify-center text-jozi-forest border border-jozi-forest/5">
                        <History className="w-6 h-6 opacity-40" />
                      </div>
                      <div>
                        <p className="font-black text-jozi-dark text-sm leading-none mb-1">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 text-center">
                    <div className="flex justify-center -space-x-2">
                       {item.platforms.map((p, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                           {getIcon(p)}
                         </div>
                       ))}
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                       <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                       {item.date}
                    </div>
                  </td>
                  <td className="py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      item.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-8">
                     <p className="text-xs font-medium text-gray-400 leading-relaxed italic max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible">
                       {item.feedback || 'Awaiting platform review...'}
                     </p>
                  </td>
                  <td className="py-8 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-forest transition-all shadow-sm">
                         <Eye className="w-4 h-4" />
                       </button>
                       <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-forest transition-all shadow-sm">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExposureHistory;