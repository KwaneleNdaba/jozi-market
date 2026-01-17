
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit3, Trash2, Zap, Shield, BarChart3, 
  X, Check, AlertCircle, ArrowLeft, Settings2, Filter, Loader2, Calendar, XCircle
} from 'lucide-react';
import Link from 'next/link';
import { IFeature, ICreateFeature, IUpdateFeature } from '@/interfaces/subscription/subscription';
import { 
  getAllFeaturesAction, 
  createFeatureAction, 
  updateFeatureAction, 
  deleteFeatureAction 
} from '@/app/actions/feature';
import { useToast } from '@/app/contexts/ToastContext';

// Helper to format date
const formatDate = (date?: Date | string): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const AdminFeatureManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<IFeature | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<IFeature | null>(null);

  // Fetch features on mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await getAllFeaturesAction();
      if (response.error || !response.data) {
        showError(response.message || 'Failed to fetch features');
        setFeatures([]);
      } else {
        setFeatures(response.data);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase()) ||
    f.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (feat?: IFeature) => {
    setEditingFeature(feat || null);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (feature: IFeature) => {
    setFeatureToDelete(feature);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!featureToDelete?.id) return;

    try {
      const response = await deleteFeatureAction(featureToDelete.id);
      if (response.error) {
        showError(response.message || 'Failed to delete feature');
      } else {
        showSuccess('Feature deleted successfully');
        setIsDeleteModalOpen(false);
        setFeatureToDelete(null);
        await fetchFeatures();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete feature');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const slug = formData.get('slug') as string;

    if (editingFeature) {
        // Update existing feature
        const updateData: IUpdateFeature = {
          id: editingFeature.id!,
          name,
          description,
          slug: slug || undefined,
        };
        const response = await updateFeatureAction(updateData);
        
        if (response.error || !response.data) {
          throw new Error(response.message || 'Failed to update feature');
        }
        
        showSuccess('Feature updated successfully');
    } else {
        // Create new feature
        const createData: ICreateFeature = {
          name,
          description,
          slug: slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        };
        const response = await createFeatureAction(createData);
        
        if (response.error || !response.data) {
          throw new Error(response.message || 'Failed to create feature');
    }
        
        showSuccess('Feature created successfully');
      }

      setIsModalOpen(false);
      setEditingFeature(null);
      await fetchFeatures();
    } catch (err: any) {
      showError(err.message || 'Failed to save feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Capability <br /><span className="text-jozi-gold">Governance.</span>
              </h1>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Register New Capability
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-jozi-forest/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search capabilities..." 
                className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchFeatures}
                disabled={loading}
                className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-gold disabled:opacity-50 transition-all"
              >
                <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-gold"><Filter className="w-5 h-5" /></button>
              <button className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-gold"><Settings2 className="w-5 h-5" /></button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
              <p className="text-gray-400 font-bold">Loading features...</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Slug</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Created At</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Updated At</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                  {filteredFeatures.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center">
                          <Zap className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-gray-400 font-bold">No features found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFeatures.map((f) => (
                  <tr key={f.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="py-8">
                      <div className="space-y-1">
                        <p className="font-black text-jozi-forest text-lg">{f.name}</p>
                            <p className="text-sm text-gray-400 font-medium max-w-md">{f.description}</p>
                      </div>
                    </td>
                    <td className="py-8">
                          <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{f.slug}</code>
                        </td>
                        <td className="py-8">
                          <div className="flex items-center text-gray-400 text-xs font-bold">
                            <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                            {formatDate(f.createdAt)}
                          </div>
                    </td>
                    <td className="py-8">
                          <div className="flex items-center text-gray-400 text-xs font-bold">
                            <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                            {formatDate(f.updatedAt)}
                          </div>
                    </td>
                    <td className="py-8 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenModal(f)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest hover:bg-white transition-all shadow-sm">
                          <Edit3 className="w-4 h-4" />
                        </button>
                            <button 
                              onClick={() => openDeleteConfirm(f)} 
                              className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 hover:bg-white transition-all shadow-sm"
                            >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-xl rounded-5xl p-10 shadow-2xl relative overflow-hidden">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
              <form onSubmit={handleSubmit} className="space-y-8">
                <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{editingFeature ? 'Edit' : 'Create'} Feature</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Name *</label>
                    <input name="name" required defaultValue={editingFeature?.name} type="text" placeholder="e.g. AI Recommendations" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description *</label>
                    <textarea name="description" required defaultValue={editingFeature?.description} rows={3} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none resize-none border-2 border-transparent focus:border-jozi-gold/20" placeholder="Enter feature description..." />
                  </div>
                    <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Slug {editingFeature ? '(Optional)' : '*'}</label>
                    <input 
                      name="slug" 
                      required={!editingFeature}
                      defaultValue={editingFeature?.slug} 
                      type="text" 
                      placeholder="e.g. ai-recommendations (auto-generated from name if empty)" 
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 font-mono text-sm" 
                    />
                    <p className="text-[9px] text-gray-400 font-medium">Slug will be auto-generated from name if left empty</p>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-5 bg-jozi-forest text-white rounded-2xl font-black uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {editingFeature ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingFeature ? 'Synchronize Updates' : 'Initialize Capability'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && featureToDelete && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-4xl p-10 lg:p-12 w-full max-w-md relative shadow-2xl text-left"
            >
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-rose-50 text-rose-500">
                <XCircle className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase mb-4 text-center">Security Protocol</h3>
              <p className="text-gray-500 font-medium mb-6 text-center">
                Are you absolutely sure you want to <span className="text-jozi-dark font-black">DELETE</span> the capability <span className="text-jozi-forest font-black">"{featureToDelete.name}"</span>? This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDelete}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all bg-rose-500 hover:bg-rose-600"
                >
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setFeatureToDelete(null);
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

export default AdminFeatureManagement;
