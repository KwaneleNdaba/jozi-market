import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  BarChart3, 
  Settings, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Download,
  ShieldCheck,
  AlertCircle,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import ExposureQueue from '../../components/admin/exposure/ExposureQueue';
import ExposureAnalyticsDashboard from '../../components/admin/exposure/ExposureAnalyticsDashboard';
import VendorCreditMonitor from '../../components/admin/exposure/VendorCreditMonitor';
import SocialScheduler from '../../components/admin/exposure/SocialScheduler';

const AdminExposurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'scheduler' | 'analytics' | 'governance'>('queue');

  const tabs = [
    { id: 'queue', label: 'Broadcast Queue', icon: Clock },
    { id: 'scheduler', label: 'Platform Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Campaign Yield', icon: BarChart3 },
    { id: 'governance', label: 'Artisan Credits', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="grow p-8 lg:p-12 space-y-10 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
          <div className="space-y-4">
             <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Admin Hub
             </Link>
             <h1 className="text-4xl lg:text-5xl font-black text-jozi-dark tracking-tighter uppercase leading-none">
                Social <br /><span className="text-jozi-gold">Exposure Hub.</span>
             </h1>
          </div>

          <div className="flex items-center space-x-3">
             <div className="hidden md:flex flex-col text-right mr-4">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active Broadcasting</p>
                <p className="text-sm font-black text-jozi-forest">4 Platforms • 24 Daily Slots</p>
             </div>
             <button className="bg-white border border-gray-100 p-4 rounded-2xl shadow-soft text-gray-400 hover:text-jozi-forest transition-all">
                <Download className="w-5 h-5" />
             </button>
             <button className="bg-jozi-dark text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold hover:text-jozi-dark transition-all shadow-xl shadow-jozi-dark/10">
                Performance Audit
             </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-3 px-10 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20' 
                  : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'queue' && <ExposureQueue />}
            {activeTab === 'scheduler' && <SocialScheduler />}
            {activeTab === 'analytics' && <ExposureAnalyticsDashboard />}
            {activeTab === 'governance' && <VendorCreditMonitor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminExposurePage;