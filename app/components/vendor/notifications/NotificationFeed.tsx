
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added ChevronRight and Bell to the imports below
import { 
  Search, Filter, CheckCircle2, Trash2, Download, 
  ShoppingBag, Tag, AlertTriangle, Wallet, BrainCircuit,
  Calendar, MoreVertical, Eye, MailCheck, MailOpen, X,
  ChevronRight, Bell
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';

type NotificationType = 'Order' | 'Promotion' | 'Inventory' | 'Payout' | 'AI Insight';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  status: 'Read' | 'Unread';
  relatedId?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'Order', title: 'New Manifest Logged', message: 'Neighbor Lerato D. placed an order (#ORD-2045) for Shweshwe Evening Dress.', timestamp: '2024-10-15 14:30', status: 'Unread', relatedId: '#ORD-2045' },
  { id: '2', type: 'AI Insight', title: 'Optimal Pricing Alert', message: 'AI suggests increasing "Zebu Leather Wallet" price by 12% based on regional scarcity.', timestamp: '2024-10-15 12:15', status: 'Unread' },
  { id: '3', type: 'Inventory', title: 'Critical Stock Alarm', message: 'Vault balance for "Indigo Silk Scarf" is below threshold (2 left).', timestamp: '2024-10-14 09:00', status: 'Read' },
  { id: '4', type: 'Payout', title: 'Capital Settlement Successful', message: 'R12,450 has been successfully dispatched to your Standard Bank account.', timestamp: '2024-10-13 16:45', status: 'Read' },
  { id: '5', type: 'Promotion', title: 'Voucher Yield Update', message: '"JOZI-HERITAGE" has reached 80% usage capacity. 452/500 claimed.', timestamp: '2024-10-12 11:30', status: 'Read' },
  { id: '6', type: 'Order', title: 'Item Returned', message: 'Neighbor Kevin N. initiated a return for #ORD-2038 due to sizing.', timestamp: '2024-10-11 15:20', status: 'Read', relatedId: '#ORD-2038' },
];

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'Order': return <ShoppingBag className="w-5 h-5" />;
    case 'Promotion': return <Tag className="w-5 h-5" />;
    case 'Inventory': return <AlertTriangle className="w-5 h-5" />;
    case 'Payout': return <Wallet className="w-5 h-5" />;
    case 'AI Insight': return <BrainCircuit className="w-5 h-5" />;
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case 'Order': return 'text-blue-500 bg-blue-50';
    case 'Promotion': return 'text-purple-500 bg-purple-50';
    case 'Inventory': return 'text-orange-500 bg-orange-50';
    case 'Payout': return 'text-emerald-500 bg-emerald-50';
    case 'AI Insight': return 'text-jozi-gold bg-jozi-gold/10';
  }
};

const NotificationFeed: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredNotifs = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || n.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, activeFilter]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'Read' } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'Read' })));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Card */}
      <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-soft border border-gray-100 flex flex-col lg:flex-row gap-8 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search manifests, products or alerts..." 
            className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {['All', 'Order', 'Inventory', 'Payout', 'AI Insight', 'Promotion'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type as any)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === type 
                  ? 'bg-jozi-forest text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-jozi-forest text-white p-4 rounded-2xl shadow-xl"
          >
            <div className="flex items-center space-x-4 ml-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedIds.length} Selected</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={deleteSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="p-2 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6">
        <p className="text-xs font-bold text-gray-400 italic">Showing {filteredNotifs.length} total communications</p>
        <div className="flex items-center space-x-4">
           <button 
            onClick={markAllAsRead}
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-jozi-gold hover:text-jozi-forest transition-colors"
           >
              <MailCheck className="w-4 h-4 mr-2" /> Mark All Read
           </button>
           <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-jozi-forest transition-colors">
              <Download className="w-4 h-4 mr-2" /> Export CSV
           </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <motion.div 
              layout
              key={notif.id}
              className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all flex items-start space-x-6 relative overflow-hidden group ${
                notif.status === 'Unread' ? 'border-jozi-forest/10 shadow-soft' : 'border-transparent opacity-70 grayscale-[0.5]'
              }`}
            >
              {/* Unread Indicator */}
              {notif.status === 'Unread' && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-jozi-gold" />
              )}

              {/* Selection Checkbox */}
              <div className="pt-3">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(notif.id)}
                  onChange={() => toggleSelect(notif.id)}
                  className="w-5 h-5 rounded-md border-gray-300 accent-jozi-forest cursor-pointer" 
                />
              </div>

              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getTypeColor(notif.type)}`}>
                {getTypeIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-grow space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-jozi-gold">{notif.type}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notif.timestamp}</span>
                  </div>
                  {notif.status === 'Unread' && (
                    <span className="bg-jozi-gold text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm w-fit">New Alert</span>
                  )}
                </div>

                <h4 className="text-xl font-black text-jozi-forest tracking-tight">{notif.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-4xl">
                  {notif.message}
                </p>

                <div className="flex items-center space-x-4 pt-4">
                  {notif.relatedId && (
                    <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-jozi-forest bg-jozi-forest/5 px-4 py-2 rounded-xl hover:bg-jozi-gold hover:text-white transition-all shadow-sm">
                      View Linked Asset ({notif.relatedId}) <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  )}
                  {notif.type === 'AI Insight' && (
                    <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-white bg-jozi-dark px-4 py-2 rounded-xl hover:bg-jozi-forest transition-all shadow-xl">
                      Apply Suggestion <BrainCircuit className="w-3.5 h-3.5 ml-2" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Actions */}
              <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {notif.status === 'Unread' ? (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-500 transition-colors" 
                    title="Mark as Read"
                  >
                    <MailOpen className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-3 bg-gray-50 rounded-xl text-gray-400 cursor-default" title="Already Read">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="p-3 text-gray-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-6">
              <Bell className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-jozi-forest uppercase">Quiet Skies</h3>
            <p className="text-gray-400 font-medium italic">No notifications found matching your current filters.</p>
            <button 
              onClick={() => {setActiveFilter('All'); setSearchQuery('');}}
              className="mt-8 text-xs font-black text-jozi-gold uppercase tracking-widest hover:underline"
            >
              Clear All Logic
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon for consistency if not imported
const MoreHorizontal = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
);

export default NotificationFeed;
