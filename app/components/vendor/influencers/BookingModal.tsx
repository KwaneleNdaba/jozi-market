import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Package, MessageSquare, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: any;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, influencer }) => {
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [budget, setBudget] = useState('2500');

  if (!influencer) return null;

  const handleBook = () => {
    alert('Campaign Request Transmitted. The Oracle is processing.');
    onClose();
    setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden text-left"
          >
            {/* Modal Header */}
            <div className="bg-jozi-forest p-10 text-white flex items-center justify-between relative overflow-hidden">
               <div className="absolute right-0 top-0 p-8 opacity-10 pointer-events-none">
                  <Zap className="w-48 h-48" />
               </div>
               <div className="flex items-center space-x-6 relative z-10">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/20">
                    <img src={influencer.avatar} className="w-full h-full object-cover" alt={influencer.name} />
                  </div>
                  <div>
                    <p className="text-jozi-gold text-[10px] font-black uppercase tracking-[0.4em]">Initialize Campaign</p>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{influencer.name}</h2>
                  </div>
               </div>
               <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all relative z-10">
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 lg:p-12 space-y-10">
               {/* Selection Steps */}
               <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest border-l-4 border-jozi-gold pl-3">
                       <Package className="w-4 h-4 mr-2" /> 1. Select Pieces to Promote
                    </label>
                    <div className="flex flex-wrap gap-3">
                       {['Heritage Dress', 'Zebu Wallet', 'Indigo Scarf', 'Clay Pottery'].map((p) => (
                         <button
                           key={p}
                           onClick={() => setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                           className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                             selectedProducts.includes(p) ? 'bg-jozi-forest border-jozi-forest text-white' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-white hover:border-jozi-gold/20'
                           }`}
                         >
                           {p}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest border-l-4 border-jozi-gold pl-3">
                          <Calendar className="w-4 h-4 mr-2" /> 2. Dispatch Timing
                       </label>
                       <input 
                        type="date" 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest border-l-4 border-jozi-gold pl-3">
                          <DollarSign className="w-4 h-4 mr-2" /> 3. Commercial Budget
                       </label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-jozi-forest font-black">R</span>
                          <input 
                            type="number" 
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-2xl pl-10 pr-6 py-4 font-black text-lg text-jozi-forest outline-none transition-all"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest border-l-4 border-jozi-gold pl-3">
                       <MessageSquare className="w-4 h-4 mr-2" /> 4. Custom Directives
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Special instructions for the creator..."
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-[2rem] px-8 py-6 font-medium text-sm text-jozi-forest outline-none transition-all resize-none"
                    />
                  </div>
               </div>

               {/* Trust Footer */}
               <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center space-x-3 text-emerald-500">
                     <ShieldCheck className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Escrow Protected</span>
                  </div>
                  <button 
                    disabled={selectedProducts.length === 0}
                    onClick={handleBook}
                    className={`px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center shadow-2xl transition-all group ${
                      selectedProducts.length === 0 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : 'bg-jozi-gold text-jozi-dark hover:scale-[1.02] hover:bg-jozi-forest hover:text-white'
                    }`}
                  >
                     Dispatch Manifest <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;