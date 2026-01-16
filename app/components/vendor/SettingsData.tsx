import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, FileText, Trash2, AlertTriangle, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';

const EXPORT_OPTIONS = [
  { id: 'orders', label: 'Order Manifest', desc: 'Complete history of workshop sales in CSV format.', icon: FileText },
  { id: 'products', label: 'Product Vault', desc: 'Export all listed treasures and variation metadata.', icon: Database },
  { id: 'payouts', label: 'Capital Ledger', icon: Download, desc: 'Detailed financial summary and tax-ready invoices.' },
];

const SettingsData: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Artifact Archives" 
        sub="Control your workshop data and digital ownership." 
        icon={Database}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Data Export */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
             <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-10">Data Export Module</h3>
             <div className="space-y-6">
                {EXPORT_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-jozi-gold/30 hover:bg-white transition-all gap-6">
                     <div className="flex items-center space-x-5">
                        <div className="p-3 bg-white rounded-xl text-gray-400 shadow-sm group-hover:text-jozi-gold transition-colors">
                           <opt.icon className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-black text-jozi-forest text-sm">{opt.label}</h4>
                           <p className="text-xs text-gray-400 font-medium">{opt.desc}</p>
                        </div>
                     </div>
                     <button className="bg-jozi-forest text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all flex items-center shrink-0">
                        Generate CSV
                     </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Privacy & Compliance */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 text-left space-y-10">
             <div className="space-y-4">
                <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Legal Ownership</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">As a Jozi Market Artisan, you maintain 100% intellectual property rights over your designs. We act as a facilitator under the <span className="text-jozi-forest font-bold underline decoration-jozi-gold">POPIA Data Protection Framework</span>.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                <div className="space-y-4">
                   <div className="flex items-center space-x-3 text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                   </div>
                   <p className="text-xs text-gray-400">All customer delivery data is scrubbed from our systems 30 days after successful fulfillment.</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center space-x-3 text-jozi-gold">
                      <Share2 className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Artisan Rights</span>
                   </div>
                   <p className="text-xs text-gray-400">You can request a full audit of your store data and behavioral analytics at any time.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Account Closure Card */}
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-soft space-y-8 text-left">
              <div className="flex items-center space-x-3 text-red-500">
                 <Trash2 className="w-6 h-6" />
                 <h3 className="text-lg font-black uppercase tracking-tight">Workshop Exit</h3>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">Temporarily deactivate your store or permanently close your artisan account.</p>
              
              <div className="space-y-4">
                 <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
                   Deactivate Storefront
                 </button>
                 <button className="w-full py-4 border-2 border-dashed border-red-100 text-red-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                   Terminate Account
                 </button>
              </div>
           </div>

           <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start space-x-4 text-left">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="space-y-2">
                 <h4 className="font-black text-amber-900 text-sm uppercase">Pending Payouts</h4>
                 <p className="text-xs text-amber-800 font-medium leading-relaxed italic">"Account closure will only be finalized once all <span className="font-bold">R12,450 pending capital</span> has been settled and 30 days have passed for return claims."</p>
                 <button className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center hover:underline">
                    Settlement Status <ArrowRight className="ml-1 w-3 h-3" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsData;