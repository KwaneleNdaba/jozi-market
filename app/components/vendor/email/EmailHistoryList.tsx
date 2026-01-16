import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Send, 
  Eye, 
  MousePointer2, 
  Target, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';
import SectionHeader from '../../SectionHeader';

const MOCK_HISTORY = [
  { id: 'cam-1', name: 'Midnight Shweshwe Launch', date: 'Oct 12, 2024', status: 'Sent', recipients: '2,450', openRate: '48.2%', clickRate: '12.4%', revenue: 'R12,450', color: 'bg-emerald-500' },
  { id: 'cam-2', name: 'Spring Accessory Drive', date: 'Oct 15, 2024', status: 'Scheduled', recipients: '1,800', openRate: '—', clickRate: '—', revenue: 'R0', color: 'bg-blue-500' },
  { id: 'cam-3', name: 'Dormant Neighbor Winback', date: 'Sep 28, 2024', status: 'Sent', recipients: '450', openRate: '24.1%', clickRate: '4.2%', revenue: 'R4,820', color: 'bg-jozi-gold' },
  { id: 'cam-4', name: 'Heritage Week Announcement', date: 'Sep 15, 2024', status: 'Sent', recipients: '5,200', openRate: '56.8%', clickRate: '18.1%', revenue: 'R42,100', color: 'bg-emerald-500' },
];

const EmailHistoryList: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Broadcast Ledger" 
        sub="A detailed audit of every commercial communication dispatched from your workshop." 
        icon={History}
      />

      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Campaign Asset</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Fleet Size</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Engagement</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Revenue (ZAR)</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_HISTORY.map((cam, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-8">
                    <div className="flex items-center space-x-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${cam.color}`}>
                          <Send className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black text-jozi-dark text-sm leading-tight">{cam.name}</p>
                          <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                             <Calendar className="w-3 h-3 mr-1 opacity-40" /> {cam.date}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-8 text-center">
                    <StatusBadge status={cam.status} className={cam.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'} />
                  </td>
                  <td className="py-8 font-bold text-gray-400 text-sm">{cam.recipients} Neighbors</td>
                  <td className="py-8">
                     <div className="grid grid-cols-2 gap-4 max-w-[150px]">
                        <div>
                           <p className="text-[9px] font-black uppercase text-gray-300">Opens</p>
                           <p className="font-black text-jozi-forest text-sm">{cam.openRate}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-gray-300">Clicks</p>
                           <p className="font-black text-jozi-gold text-sm">{cam.clickRate}</p>
                        </div>
                     </div>
                  </td>
                  <td className="py-8 text-right">
                     <div className="flex flex-col items-end">
                        <p className="font-black text-xl text-jozi-forest leading-none">R{cam.revenue}</p>
                        {cam.status === 'Sent' && (
                           <div className="flex items-center text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2">
                              <TrendingUp className="w-2.5 h-2.5 mr-1" /> Verified ROI
                           </div>
                        )}
                     </div>
                  </td>
                  <td className="py-8 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-forest transition-all shadow-sm"><BarChart3 className="w-4 h-4" /></button>
                       <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-forest transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                       <button className="p-3 text-gray-200"><MoreVertical className="w-4 h-4" /></button>
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

export default EmailHistoryList;