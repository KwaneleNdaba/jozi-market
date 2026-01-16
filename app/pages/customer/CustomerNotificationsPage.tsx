
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Bell, 
  Package, 
  Star, 
  Zap, 
  Settings, 
  Info, 
  Trash2, 
  CheckCheck, 
  MoreVertical,
  ChevronRight,
  ShoppingBag,
  Mail,
  Smartphone,
  MessageSquare,
  Award,
  Gift,
  X
} from 'lucide-react';
import CustomerSidebar from '../../components/CustomerSidebar';

type NotificationCategory = 'All' | 'Orders' | 'Rewards' | 'Promotions' | 'System' | 'Referral';

interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  cta?: {
    label: string;
    link: string;
  };
}

const MOCK_USER = {
  name: "Lerato Dlamini",
  email: "lerato.d@jozimail.com",
  avatar: "https://picsum.photos/seed/lerato/200/200",
  level: 22,
  points: 1250
};

const MOCK_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'n1',
    title: 'Order Delivered! 🇿🇦',
    message: 'Your Shweshwe Evening Dress has been safely delivered to Newtown. Enjoy your new treasure!',
    category: 'Orders',
    timestamp: '2 hours ago',
    isRead: false,
    cta: { label: 'View Order', link: '/profile?tab=orders' }
  },
  {
    id: 'n2',
    title: 'Points Milestone Reached',
    message: 'You just earned 150 points for reviewing your last purchase. You are now 300 pts away from Gold Tier!',
    category: 'Rewards',
    timestamp: '5 hours ago',
    isRead: false,
    cta: { label: 'Go to Loyalty', link: '/rewards' }
  },
  {
    id: 'n3',
    title: 'Tier Upgrade Incoming?',
    message: 'You are on a 4-day shopping streak. Maintain it for 3 more days to unlock the "Active Neighbor" badge.',
    category: 'System',
    timestamp: 'Yesterday',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Flash Deal: 15% OFF Silk',
    message: 'Maboneng Textiles just launched a 24-hour flash sale on all heritage silk wraps. Don\'t miss out!',
    category: 'Promotions',
    timestamp: '1 day ago',
    isRead: true,
    cta: { label: 'Shop Deals', link: '/deals' }
  },
  {
    id: 'n5',
    title: 'Referral Success! 🎉',
    message: 'Your friend Tshepo M. just joined Jozi Market using your link. You\'ve been awarded 500 bonus points.',
    category: 'Referral',
    timestamp: '2 days ago',
    isRead: true,
    cta: { label: 'View Leaderboard', link: '/referrals' }
  },
  {
    id: 'n6',
    title: 'System Maintenance',
    message: 'Jozi Market will be undergo brief maintenance tonight between 02:00 and 04:00 AM SAST.',
    category: 'System',
    timestamp: '3 days ago',
    isRead: true,
  }
];

const CustomerNotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [filter, setFilter] = useState<NotificationCategory>('All');
  const [notifications, setNotifications] = useState<CustomerNotification[]>(MOCK_NOTIFICATIONS);

  const categories: NotificationCategory[] = ['All', 'Orders', 'Rewards', 'Promotions', 'System'];

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length, 
  [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return notifications;
    return notifications.filter(n => n.category === filter);
  }, [notifications, filter]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const getIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Orders': return <Package className="w-5 h-5" />;
      case 'Rewards': return <Star className="w-5 h-5" />;
      case 'Promotions': return <Zap className="w-5 h-5" />;
      case 'Referral': return <Award className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (category: NotificationCategory) => {
    switch (category) {
      case 'Orders': return 'text-blue-500 bg-blue-50';
      case 'Rewards': return 'text-jozi-gold bg-jozi-gold/10';
      case 'Promotions': return 'text-rose-500 bg-rose-50';
      case 'Referral': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen pb-32">
      <div className="container mx-auto px-4 pt-12 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <CustomerSidebar user={MOCK_USER} />

          <main className="flex-grow space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-left space-y-2">
                <div className="inline-flex items-center space-x-2 bg-jozi-forest/5 text-jozi-forest px-3 py-1 rounded-full border border-jozi-forest/10">
                  <Bell className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Connectivity Hub</span>
                </div>
                <h1 className="text-5xl font-black text-jozi-forest tracking-tighter leading-none uppercase">
                  Alert <br /><span className="text-jozi-gold">Command.</span>
                </h1>
                <p className="text-gray-400 font-medium italic">Stay in sync with your workshop treasures.</p>
              </div>

              {activeTab === 'inbox' && unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="flex items-center space-x-2 bg-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-jozi-forest border border-jozi-forest/10 hover:bg-jozi-forest hover:text-white transition-all shadow-soft"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark All As Read</span>
                </button>
              )}
            </div>

            {/* Sub-navigation */}
            <div className="flex p-1.5 bg-white rounded-2xl shadow-soft border border-jozi-forest/5 w-fit">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'inbox' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
                }`}
              >
                Inbox {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'settings' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
                }`}
              >
                Preferences
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'inbox' ? (
                <motion.div
                  key="inbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Filter Chips */}
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          filter === cat 
                            ? 'bg-jozi-gold text-jozi-dark shadow-lg' 
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-jozi-gold/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notif, idx) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={notif.id}
                          className={`group bg-white p-8 rounded-[2.5rem] border-2 transition-all flex items-start space-x-6 relative overflow-hidden ${
                            notif.isRead ? 'border-transparent opacity-75' : 'border-jozi-forest/10 shadow-soft'
                          }`}
                        >
                          {!notif.isRead && (
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-jozi-gold" />
                          )}
                          
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getColor(notif.category)}`}>
                            {getIcon(notif.category)}
                          </div>

                          <div className="flex-grow text-left space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-jozi-gold">{notif.category}</span>
                                <h3 className={`text-xl font-black text-jozi-forest tracking-tight ${!notif.isRead ? 'opacity-100' : 'opacity-70'}`}>
                                  {notif.title}
                                </h3>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notif.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                              {notif.message}
                            </p>
                            
                            <div className="flex items-center space-x-6 pt-4">
                              {notif.cta && (
                                <Link 
                                  href={notif.cta.link}
                                  className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-jozi-forest bg-jozi-forest/5 px-4 py-2 rounded-xl hover:bg-jozi-gold hover:text-white transition-all shadow-sm group/cta"
                                >
                                  {notif.cta.label}
                                  <ChevronRight className="w-3 h-3 ml-1 group-hover/cta:translate-x-1 transition-transform" />
                                </Link>
                              )}
                              <button 
                                onClick={() => toggleRead(notif.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors"
                              >
                                {notif.isRead ? 'Mark Unread' : 'Mark Read'}
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="p-3 bg-gray-50 text-gray-300 rounded-xl opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm self-center"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 space-y-8">
                         <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                           <Bell className="w-12 h-12" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Nothing New Yet</h3>
                            <p className="text-gray-400 font-medium italic mt-2">Your inbox is clear! Start exploring our latest drops.</p>
                         </div>
                         <Link href="/shop" className="inline-block bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                           Explore Gallery
                         </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Notification Types */}
                  <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 space-y-10 text-left">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Alert Streams</h3>
                        <p className="text-xs text-gray-400 font-medium">Select which categories trigger notifications.</p>
                     </div>
                     <div className="space-y-6">
                        {[
                          { id: 'orders', label: 'Order Manifests', icon: ShoppingBag, desc: 'Shipping, delivery, and return updates.' },
                          { id: 'rewards', label: 'Loyalty & Points', icon: Gift, desc: 'Tier upgrades and points earning alerts.' },
                          { id: 'promos', label: 'Market Promotions', icon: Zap, desc: 'Flash sales and artisan spotlights.' },
                          { id: 'system', label: 'Platform Announcements', icon: Info, desc: 'Maintenance and security protocols.' }
                        ].map((pref) => (
                          <div key={pref.id} className="flex items-center justify-between group">
                             <div className="flex items-center space-x-5">
                                <div className="p-3 bg-jozi-cream rounded-xl text-jozi-forest group-hover:bg-jozi-gold transition-colors">
                                   <pref.icon className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="font-black text-sm text-jozi-forest">{pref.label}</p>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.desc}</p>
                                </div>
                             </div>
                             <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner cursor-pointer">
                                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Delivery Channels */}
                  <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 space-y-10 text-left">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Delivery Hubs</h3>
                        <p className="text-xs text-gray-400 font-medium">Control where your alerts are dispatched.</p>
                     </div>
                     <div className="space-y-6">
                        {[
                          { id: 'push', label: 'In-App & Mobile Push', icon: Smartphone, desc: 'Real-time alerts on your device.' },
                          { id: 'email', label: 'Verified Email', icon: Mail, desc: 'Detailed manifest summaries.' },
                          { id: 'sms', label: 'Priority SMS', icon: MessageSquare, desc: 'Critical security and shipping alerts.' }
                        ].map((chan) => (
                          <div key={chan.id} className="flex items-center justify-between group">
                             <div className="flex items-center space-x-5">
                                <div className="p-3 bg-jozi-cream rounded-xl text-jozi-forest group-hover:bg-jozi-gold transition-colors">
                                   <chan.icon className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="font-black text-sm text-jozi-forest">{chan.label}</p>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chan.desc}</p>
                                </div>
                             </div>
                             <div className={`w-12 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors ${chan.id === 'sms' ? 'bg-gray-100' : 'bg-emerald-500'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${chan.id === 'sms' ? 'left-1' : 'right-1'}`} />
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Global DND Active?</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-jozi-gold hover:text-jozi-forest">Configure Silence</button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerNotificationsPage;