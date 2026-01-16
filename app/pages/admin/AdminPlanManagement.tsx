
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  DollarSign, 
  Percent, 
  Zap, 
  ArrowLeft,
  X,
  Layers,
  Layout,
  Star,
  Users,
  Eye,
  Info,
  ChevronRight,
  XCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { 
  ISubscriptionPlan, 
  ICreateSubscriptionPlan, 
  IUpdateSubscriptionPlan,
  SubscriptionPlanStatus,
  SubscriptionDuration
} from '@/interfaces/subscription/subscription';
import {
  getAllSubscriptionPlansAction,
  createSubscriptionPlanAction,
  updateSubscriptionPlanAction,
  deleteSubscriptionPlanAction
} from '@/app/actions/subscription';
import { useToast } from '@/app/contexts/ToastContext';

// Extended interface for display purposes (includes vendorCount which is calculated)
interface DisplayPlan extends ISubscriptionPlan {
  vendorCount?: number;
  commission?: number; // For UI display, this might come from a separate calculation
}

const AdminPlanManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [plans, setPlans] = useState<DisplayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ISubscriptionPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<ISubscriptionPlan | null>(null);

  // Form State
  const [formData, setFormData] = useState<ICreateSubscriptionPlan>({
    name: '',
    subtitle: '',
    description: '',
    price: 0,
    duration: SubscriptionDuration.MONTHLY,
    status: SubscriptionPlanStatus.ACTIVE,
    isDark: false,
    isStar: false
  });

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getAllSubscriptionPlansAction();
      if (response.error || !response.data) {
        showError(response.message || 'Failed to fetch subscription plans');
        setPlans([]);
      } else {
        // Transform backend plans to display plans
        const displayPlans: DisplayPlan[] = response.data.map(plan => ({
          ...plan,
          vendorCount: 0, // TODO: Calculate from user subscriptions if needed
        }));
        setPlans(displayPlans);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan?: ISubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        subtitle: plan.subtitle,
        description: plan.description,
        price: plan.price,
        duration: plan.duration as SubscriptionDuration,
        status: plan.status as SubscriptionPlanStatus,
        isDark: plan.isDark,
        isStar: plan.isStar
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        subtitle: '',
        description: '',
        price: 0,
        duration: SubscriptionDuration.MONTHLY,
        status: SubscriptionPlanStatus.ACTIVE,
        isDark: false,
        isStar: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure price is a valid number
      const priceValue = typeof formData.price === 'number' && !isNaN(formData.price) 
        ? formData.price 
        : parseFloat(String(formData.price)) || 0;

      // Ensure boolean values are explicitly boolean
      const isDarkValue = Boolean(formData.isDark);
      const isStarValue = Boolean(formData.isStar);

      if (editingPlan) {
        // Update existing plan
        const updateData: IUpdateSubscriptionPlan = {
          id: editingPlan.id!,
          name: formData.name,
          subtitle: formData.subtitle,
          description: formData.description,
          price: priceValue,
          duration: formData.duration,
          status: formData.status,
          isDark: isDarkValue,
          isStar: isStarValue
        };
        const response = await updateSubscriptionPlanAction(updateData);
        
        if (response.error || !response.data) {
          throw new Error(response.message || 'Failed to update subscription plan');
        }
        
        showSuccess('Subscription plan updated successfully');
      } else {
        // Create new plan
        const createData: ICreateSubscriptionPlan = {
          name: formData.name,
          subtitle: formData.subtitle,
          description: formData.description,
          price: priceValue,
          duration: formData.duration,
          status: formData.status,
          isDark: isDarkValue,
          isStar: isStarValue
        };
        const response = await createSubscriptionPlanAction(createData);
        
        if (response.error || !response.data) {
          throw new Error(response.message || 'Failed to create subscription plan');
        }
        
        showSuccess('Subscription plan created successfully');
      }

      setIsModalOpen(false);
      setEditingPlan(null);
      await fetchPlans();
    } catch (err: any) {
      showError(err.message || 'Failed to save subscription plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (plan: ISubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!planToDelete?.id) return;

    try {
      const response = await deleteSubscriptionPlanAction(planToDelete.id);
      if (response.error) {
        showError(response.message || 'Failed to delete subscription plan');
      } else {
        showSuccess('Subscription plan deleted successfully');
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        await fetchPlans();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete subscription plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">
                SUBSCRIPTION <br /><span className="text-jozi-gold">TIER ENGINE.</span>
              </h1>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Tier
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Summary Stats */}
          {[
            { label: 'Total Tiers', value: plans.length, icon: Layers, color: 'text-jozi-gold' },
            { label: 'Active Subscribers', value: plans.reduce((acc, p) => acc + (p.vendorCount || 0), 0), icon: Users, color: 'text-emerald-500' },
            { label: 'Market Average Fee', value: plans.length > 0 && !isNaN(Number(plans.reduce((acc, p) => acc + Number(p.price || 0), 0))) ? `R${Math.round(plans.reduce((acc, p) => acc + Number(p.price || 0), 0) / plans.length)}` : '0', icon: DollarSign, color: 'text-blue-500' },
            { label: 'Active Plans', value: plans.filter(p => p.status === SubscriptionPlanStatus.ACTIVE).length, icon: Percent, color: 'text-jozi-forest' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-soft border border-jozi-forest/5 flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                <h3 className="text-xl font-black text-jozi-dark">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 mt-12">
            <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
            <p className="text-gray-400 font-bold">Loading subscription plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {plans.map((plan) => (
              <motion.div
                layout
                key={plan.id}
                className={`rounded-5xl p-10 flex flex-col h-full shadow-soft border-2 transition-all relative group ${
                  plan.isDark ? 'bg-jozi-dark text-white border-jozi-dark' : 'bg-white text-jozi-forest border-transparent'
                }`}
              >
                {plan.isStar ?(
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-jozi-gold text-jozi-dark text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-10 flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Recommended
                  </div>
                ) : null}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${plan.isDark ? 'text-jozi-gold' : 'text-gray-400'}`}>
                      {plan.subtitle}
                    </p>
                    <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(plan)}
                      className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:text-jozi-forest hover:bg-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteConfirm(plan)}
                      className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-8 p-6 rounded-3xl bg-jozi-cream/5 border border-white/10 space-y-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black">R{plan.price}</span>
                    <span className={`text-xs font-bold ${plan.isDark ? 'text-white/40' : 'text-gray-400'}`}>/{plan.duration === SubscriptionDuration.MONTHLY ? 'month' : 'year'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Status</span>
                    <span className={`text-xs font-black px-2 py-1 rounded ${plan.status === SubscriptionPlanStatus.ACTIVE ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                      {plan.status}
                    </span>
                  </div>
                </div>

                <p className={`text-xs font-medium leading-relaxed mb-10 ${plan.isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold opacity-60">
                    <Users className="w-4 h-4" />
                    <span>{plan.vendorCount || 0} Artisans</span>
                  </div>
                  <Link href="/admin/plan-matrix" className={`text-[10px] font-black uppercase tracking-widest flex items-center hover:underline ${plan.isDark ? 'text-jozi-gold' : 'text-jozi-forest'}`}>
                    Manage Rules <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}

          {/* Add New Card Callout */}
          <button 
            onClick={() => handleOpenModal()}
            className="rounded-5xl border-4 border-dashed border-gray-100 hover:border-jozi-gold/20 transition-all flex flex-col items-center justify-center p-12 text-center group min-h-[400px]"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-gray-300 group-hover:text-jozi-forest transition-colors uppercase tracking-tight">Add New Tier</h4>
            <p className="text-xs text-gray-300 font-bold mt-2">Expand the marketplace <br />membership options.</p>
          </button>
          </div>
        )}
      </section>

      {/* Plan Creator Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-5xl p-10 lg:p-12 shadow-2xl relative overflow-hidden"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">
                    {editingPlan ? 'Refine Tier' : 'New Tier Definition'}
                  </h3>
                  <p className="text-gray-400 font-medium italic">Define the economics and market positioning for this plan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plan Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Enterprise" 
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration *</label>
                    <select
                      required
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value as SubscriptionDuration})}
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    >
                      <option value={SubscriptionDuration.MONTHLY}>Monthly</option>
                      <option value={SubscriptionDuration.YEARLY}>Yearly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (R) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-gray-50 rounded-2xl px-6 pl-12 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as SubscriptionPlanStatus})}
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                    >
                      <option value={SubscriptionPlanStatus.ACTIVE}>Active</option>
                      <option value={SubscriptionPlanStatus.INACTIVE}>Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtitle *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subtitle}
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                      placeholder="e.g. Essential Growth, Market Leader"
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description *</label>
                    <textarea 
                      rows={3} 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe this plan to vendors..."
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none resize-none border-2 border-transparent focus:border-jozi-gold/20" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isStar: !formData.isStar})}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${formData.isStar ? 'border-jozi-gold bg-jozi-gold/5' : 'border-gray-100 opacity-60'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">Recommended</span>
                    <Star className={`w-5 h-5 ${formData.isStar ? 'text-jozi-gold fill-current' : 'text-gray-300'}`} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isDark: !formData.isDark})}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${formData.isDark ? 'border-jozi-dark bg-jozi-dark text-white' : 'border-gray-100 opacity-60'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">Dark Styling</span>
                    <Layout className={`w-5 h-5 ${formData.isDark ? 'text-jozi-gold' : 'text-gray-300'}`} />
                  </button>
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
                      {editingPlan ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingPlan ? 'Synchronize Tier Changes' : 'Initialize New Subscription Tier'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && planToDelete && (
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
                Are you absolutely sure you want to <span className="text-jozi-dark font-black">DELETE</span> the subscription plan <span className="text-jozi-forest font-black">"{planToDelete.name}"</span>? This action cannot be undone and will affect vendors assigned to this plan.
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
                    setPlanToDelete(null);
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

export default AdminPlanManagement;
