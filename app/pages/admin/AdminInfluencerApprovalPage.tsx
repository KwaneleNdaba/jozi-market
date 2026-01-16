import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, Megaphone, BarChart3, Search, Filter, 
  ArrowLeft, Download, RefreshCw, AlertCircle, 
  CheckCircle2, XCircle, Clock, ShieldCheck
} from 'lucide-react';
import ApprovalStats from '../../components/admin/influencers/ApprovalStats';
import CampaignApprovalTable from '../../components/admin/influencers/CampaignApprovalTable';
import CampaignApprovalModal from '../../components/admin/influencers/CampaignApprovalModal';
import { MOCK_APPROVAL_CAMPAIGNS } from '../../utilities/adminInfluencerMockData';

const AdminInfluencerApprovalPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState(MOCK_APPROVAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.influencer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setSelectedCampaign(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Collaboration <br /><span className="text-jozi-gold">Governance.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Audit Report
              </button>
              <button className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Compliance Check
              </button>
            </div>
          </div>

          <ApprovalStats campaigns={campaigns} />
        </div>
      </section>

      {/* Main Panel */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-soft border border-jozi-forest/5">
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vendor or creator..." 
                className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <select 
                className="bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending Approval</option>
                <option value="Approved">Active Partnerships</option>
                <option value="Rejected">Flagged</option>
              </select>
              <button className="p-4 bg-jozi-forest text-white rounded-2xl hover:bg-jozi-dark transition-all shadow-lg">
                <Filter className="w-5 h-5" />
              </button>
              <button onClick={() => setCampaigns([...MOCK_APPROVAL_CAMPAIGNS])} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <CampaignApprovalTable 
            campaigns={filteredCampaigns} 
            onView={(c) => setSelectedCampaign(c)}
            onQuickApprove={(id) => handleUpdateStatus(id, 'Approved')}
          />
        </div>
      </section>

      <AnimatePresence>
        {selectedCampaign && (
          <CampaignApprovalModal 
            campaign={selectedCampaign} 
            onClose={() => setSelectedCampaign(null)} 
            onAction={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInfluencerApprovalPage;