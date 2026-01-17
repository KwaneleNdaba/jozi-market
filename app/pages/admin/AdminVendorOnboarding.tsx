import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info, 
  Eye, 
  Mail, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  X,
  FileText,
  Download,
  MoreVertical,
  Building2,
  Phone,
  MapPin,
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Send,
  UserCheck,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { VendorApplication, OnboardingStatus, RejectionReason, REJECTION_REASONS } from '../../types';
import { getAllVendorApplicationsAction, updateVendorApplicationStatusAction } from '../../actions/vendor';
import { IVendorApplication } from '@/interfaces/vendor/vendor';
import { useToast } from '../../contexts/ToastContext';

// Helper function to map IVendorApplication to VendorApplication
const mapApplication = (app: IVendorApplication): VendorApplication => {
  // Map status from backend format to frontend format
  const statusMap: Record<string, OnboardingStatus> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Declined',
  };

  // Format date
  const formatDate = (date?: Date | string): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  // Map files to documents
  const documents: VendorApplication['documents'] = [];
  if (app.files?.idDocUrl) {
    documents.push({ name: 'ID Document', type: 'ID' as const, url: app.files.idDocUrl });
  }
  if (app.files?.cipcDocUrl) {
    documents.push({ name: 'CIPC Document', type: 'CIPC' as const, url: app.files.cipcDocUrl });
  }
  if (app.files?.bankProofUrl) {
    documents.push({ name: 'Bank Proof', type: 'Bank' as const, url: app.files.bankProofUrl });
  }
  if (app.files?.logoUrl || app.files?.bannerUrl) {
    documents.push({ name: 'Portfolio', type: 'Portfolio' as const, url: app.files.logoUrl || app.files.bannerUrl || '#' });
  }

  // Format address
  const businessAddress = app.address 
    ? `${app.address.street}, ${app.address.city}, ${app.address.postal}, ${app.address.country}`
    : 'Address not provided';

  return {
    id: app.id || '',
    businessName: app.shopName || app.legalName || 'Unknown',
    applicantName: app.contactPerson || 'Unknown',
    email: app.email || '',
    phone: app.phone || '',
    status: statusMap[app.status.toLowerCase()] || 'Pending',
    dateApplied: formatDate(app.submittedAt || app.createdAt),
    category: 'N/A', // Categories removed from vendor applications
    description: app.description || '',
    businessAddress,
    documents,
  };
};

const AdminVendorOnboarding: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const [apps, setApps] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string, type: OnboardingStatus } | null>(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('Incomplete Documentation');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Fetch applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getAllVendorApplicationsAction();
        
        if (response.error) {
          showError(response.message || 'Failed to fetch applications');
          setApps([]);
        } else {
          const mappedApps = (response.data || []).map(mapApplication);
          setApps(mappedApps);
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [showError]);

  // Refresh applications
  const refreshApplications = async () => {
    try {
      setLoading(true);
      const response = await getAllVendorApplicationsAction();
      
      if (response.error) {
        showError(response.message || 'Failed to fetch applications');
      } else {
        const mappedApps = (response.data || []).map(mapApplication);
        setApps(mappedApps);
        showSuccess('Applications refreshed successfully');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === 'Pending').length,
      approved: apps.filter(a => a.status === 'Approved').length,
      rate: apps.length > 0 ? Math.round((apps.filter(a => a.status === 'Approved').length / apps.length) * 100) : 0
    };
  }, [apps]);

  // Filtering Logic
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, statusFilter]);

  const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  // Actions
  const handleStatusUpdate = async (id: string, newStatus: OnboardingStatus) => {
    try {
      // Map frontend status to backend status
      const statusMap: Record<OnboardingStatus, string> = {
        'Pending': 'pending',
        'Approved': 'approved',
        'Declined': 'rejected',
        'More Info Requested': 'pending', // Treat as pending with a note
        'Blocked': 'rejected', // Treat as rejected
      };

      const backendStatus = statusMap[newStatus] || 'pending';

      // Determine rejection reason
      let finalRejectionReason: string | undefined = undefined;
      if (newStatus === 'Declined' || newStatus === 'Blocked') {
        if (rejectionReason === 'Other' && customRejectionReason.trim()) {
          finalRejectionReason = customRejectionReason.trim();
        } else if (rejectionReason !== 'Other') {
          finalRejectionReason = rejectionReason;
        } else {
          // Fallback if Other is selected but no custom reason provided
          finalRejectionReason = infoMessage || `Application ${newStatus.toLowerCase()}`;
        }
      }

      const response = await updateVendorApplicationStatusAction({
        id,
        status: backendStatus,
        reviewedBy: '', // Will be set by backend from token
        rejectionReason: finalRejectionReason,
      });

      if (response.error) {
        showError(response.message || 'Failed to update application status');
        return;
      }

      // Update local state
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      setIsConfirmModalOpen(false);
      setIsMoreInfoModalOpen(false);
      setConfirmAction(null);
      setInfoMessage('');
      setRejectionReason('Incomplete Documentation');
      setCustomRejectionReason('');
      
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }

      // Show success message
      const statusMessages: Record<OnboardingStatus, string> = {
        'Pending': 'Application status updated to Pending',
        'Approved': 'Application approved successfully',
        'Declined': 'Application declined',
        'More Info Requested': 'More information requested from applicant',
        'Blocked': 'Vendor blocked',
      };
      showSuccess(statusMessages[newStatus] || 'Status updated successfully');

      // Refresh applications to get latest data
      await refreshApplications();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update application status');
    }
  };

  const openConfirm = (id: string, type: OnboardingStatus) => {
    setConfirmAction({ id, type });
    setIsConfirmModalOpen(true);
    // Reset rejection reason when opening modal
    if (type === 'Declined' || type === 'Blocked') {
      setRejectionReason('Incomplete Documentation');
      setCustomRejectionReason('');
    }
  };

  const openMoreInfo = (app: VendorApplication) => {
    setSelectedApp(app);
    setIsMoreInfoModalOpen(true);
  };

  const getStatusStyles = (status: OnboardingStatus) => {
    switch (status) {
      case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Declined': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'More Info Requested': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Blocked': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header & Stats */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="px-6 lg:px-12 relative z-10 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
        
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Vendor <br /><span className="text-jozi-gold">Onboarding.</span>
              </h1>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full md:w-auto">
              {[
                { label: 'Total Apps', val: stats.total, icon: Briefcase },
                { label: 'Pending', val: stats.pending, icon: RefreshCw },
                { label: 'Approved', val: stats.approved, icon: UserCheck },
                { label: 'Growth Rate', val: `${stats.rate}%`, icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left">
                  <div className="flex items-center space-x-3 text-jozi-gold mb-1">
                    <s.icon className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{s.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white leading-none">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Table Content */}
      <section className="px-6 lg:px-12 -mt-12 relative z-20">
        <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-jozi-forest/5">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Artisan or Business..." 
                className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm text-jozi-dark outline-none transition-all placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <select 
                className="bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-sm text-jozi-dark outline-none appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status: All</option>
                {['Pending', 'Approved', 'Declined', 'More Info Requested', 'Blocked'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                onClick={refreshApplications}
                disabled={loading}
                className="p-4 bg-jozi-forest text-white rounded-2xl hover:bg-jozi-dark transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
              <p className="text-gray-400 font-bold">Loading applications...</p>
            </div>
          )}

          {/* Applications Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Workshop / Applicant</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Application Status</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date Lodged</th>
                    <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedApps.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center">
                          <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-gray-400 font-bold">No applications found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {paginatedApps.map((app) => (
                        <motion.tr 
                          layout
                          key={app.id} 
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-jozi-cream rounded-xl flex items-center justify-center text-jozi-forest font-black border border-jozi-forest/5">
                                {app.businessName[0]}
                              </div>
                              <div>
                                <p className="font-black text-jozi-dark text-sm leading-none mb-1">{app.businessName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.applicantName} • {app.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center text-gray-400 text-xs font-bold">
                               <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                               {app.dateApplied}
                            </div>
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => setSelectedApp(app)}
                                title="View Full Profile"
                                className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest hover:bg-white transition-all shadow-sm group/btn"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {/* Only show approve/decline buttons if status is not Approved or Declined */}
                              {app.status !== 'Approved' && app.status !== 'Declined' && (
                                <>
                              <button 
                                onClick={() => handleStatusUpdate(app.id, 'Approved')}
                                title="Approve Application"
                                className="p-3 bg-emerald-50 text-emerald-400 rounded-xl hover:text-white hover:bg-emerald-500 transition-all shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => openConfirm(app.id, 'Declined')}
                                title="Decline Application"
                                className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:text-white hover:bg-rose-500 transition-all shadow-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredApps.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm font-bold text-gray-400 text-left">
                Showing <span className="text-jozi-dark">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-jozi-dark">{Math.min(currentPage * itemsPerPage, filteredApps.length)}</span> of <span className="text-jozi-dark">{filteredApps.length}</span> applications
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:border-jozi-gold hover:text-jozi-gold transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-jozi-forest text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:border-jozi-gold'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:border-jozi-gold hover:text-jozi-gold transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- MODALS --- */}

      {/* Vendor Details Side Sheet / Modal */}
      <AnimatePresence>
        {selectedApp && !isMoreInfoModalOpen && !isConfirmModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between text-left">
                <div className="flex items-center space-x-6">
                   <div className="w-16 h-16 bg-jozi-gold text-jozi-dark rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-jozi-gold/20 uppercase">
                     {selectedApp.businessName[0]}
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{selectedApp.businessName}</h2>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {selectedApp.id} • Registered {selectedApp.dateApplied}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grow overflow-y-auto p-12 space-y-12 text-left">
                {/* Profile Grid */}
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Business Profile</h3>
                        <p className="text-gray-500 font-medium leading-relaxed italic">"{selectedApp.description}"</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Contact Logic</h3>
                        <div className="space-y-4 bg-gray-50 p-6 rounded-3xl">
                           <div className="flex items-center space-x-4">
                              <Building2 className="w-4 h-4 text-jozi-gold" />
                              <span className="text-sm font-bold text-jozi-dark">{selectedApp.applicantName}</span>
                           </div>
                           <div className="flex items-center space-x-4">
                              <Mail className="w-4 h-4 text-jozi-gold" />
                              <span className="text-sm font-bold text-jozi-dark">{selectedApp.email}</span>
                           </div>
                           <div className="flex items-center space-x-4">
                              <Phone className="w-4 h-4 text-jozi-gold" />
                              <span className="text-sm font-bold text-jozi-dark">{selectedApp.phone}</span>
                           </div>
                           <div className="flex items-center space-x-4">
                              <MapPin className="w-4 h-4 text-jozi-gold" />
                              <span className="text-sm font-bold text-jozi-dark">{selectedApp.businessAddress}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Verification Artifacts</h3>
                        <div className="space-y-3">
                           {selectedApp.documents.length > 0 ? selectedApp.documents.map((doc, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 bg-jozi-cream rounded-2xl border border-jozi-forest/5 group hover:border-jozi-gold/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-3">
                                   <FileText className="w-5 h-5 text-jozi-gold" />
                                   <div className="text-left">
                                      <p className="text-xs font-black text-jozi-forest">{doc.name}</p>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase">{doc.type} Verified</p>
                                   </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-300 group-hover:text-jozi-gold" />
                             </div>
                           )) : (
                             <div className="p-8 text-center bg-rose-50 rounded-2xl border border-dashed border-rose-200">
                                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                                <p className="text-xs font-black text-rose-600 uppercase">Missing Documents</p>
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="bg-jozi-forest p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                         <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-black">Market Sentiment</h4>
                            <p className="text-[10px] font-medium opacity-70 leading-relaxed uppercase tracking-widest">Application verified and ready for review.</p>
                            <div className="flex items-center space-x-2 text-jozi-gold">
                               <RefreshCw className="w-4 h-4 animate-spin-slow" />
                               <span className="text-[10px] font-black uppercase">Background Check: Clear</span>
                            </div>
                         </div>
                         <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Action Bar Bottom */}
              {selectedApp.status !== 'Approved' && selectedApp.status !== 'Declined' && (
              <div className="p-8 bg-gray-50 flex items-center justify-end space-x-4 border-t border-gray-100">
                 <button onClick={() => openConfirm(selectedApp.id, 'Declined')} className="px-8 py-4 bg-white text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all">Decline Application</button>
                 <button onClick={() => handleStatusUpdate(selectedApp.id, 'Approved')} className="px-10 py-4 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" /> Activate Vendor
                 </button>
              </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* More Info Modal */}
      <AnimatePresence>
        {isMoreInfoModalOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMoreInfoModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-5xl p-10 lg:p-12 w-full max-w-xl relative shadow-2xl text-left"
            >
              <button onClick={() => setIsMoreInfoModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">Request Context</h3>
                    <p className="text-gray-400 font-medium">Send a secure request to <span className="text-jozi-forest font-bold">{selectedApp?.businessName}</span> for missing details.</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contextual Message</label>
                    <textarea 
                      rows={5} 
                      value={infoMessage}
                      onChange={(e) => setInfoMessage(e.target.value)}
                      placeholder="e.g. Please provide a high-res copy of your CIPC registration and a brief portfolio of previous craft work."
                      className="w-full bg-jozi-cream rounded-3xl p-6 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 resize-none"
                    />
                 </div>
                 <button 
                  onClick={() => selectedApp && handleStatusUpdate(selectedApp.id, 'More Info Requested')}
                  className="w-full py-5 bg-jozi-forest text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all flex items-center justify-center shadow-xl shadow-jozi-forest/20 group"
                 >
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Dispatch Request
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConfirmModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-4xl p-10 lg:p-12 w-full max-w-md relative shadow-2xl text-left"
            >
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-rose-50 text-rose-500">
                <XCircle className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase mb-4 text-center">Security Protocol</h3>
              <p className="text-gray-500 font-medium mb-6 text-center">
                Are you absolutely sure you want to <span className="text-jozi-dark font-black">DECLINE</span> this vendor? This action will notify the applicant immediately.
              </p>
              
              {/* Rejection Reason Dropdown */}
              {confirmAction?.type === 'Declined' && (
                <div className="mb-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Rejection Reason <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value as RejectionReason)}
                      className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-dark outline-none appearance-none cursor-pointer"
                    >
                      {REJECTION_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Custom reason input - Show when "Other" is selected */}
                  {rejectionReason === 'Other' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Custom Reason <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={customRejectionReason}
                        onChange={(e) => setCustomRejectionReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejection..."
                        rows={3}
                        className="w-full bg-jozi-cream rounded-2xl p-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4">
                 <button 
                  onClick={() => {
                    // Validate rejection reason
                    if (rejectionReason === 'Other' && !customRejectionReason.trim()) {
                      showError('Please provide a custom rejection reason');
                      return;
                    }
                    confirmAction && handleStatusUpdate(confirmAction.id, confirmAction.type);
                  }}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all bg-rose-500 hover:bg-rose-600"
                 >
                    Confirm Lifecycle Change
                 </button>
                 <button 
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setRejectionReason('Incomplete Documentation');
                    setCustomRejectionReason('');
                  }} 
                  className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                 >
                   Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVendorOnboarding;