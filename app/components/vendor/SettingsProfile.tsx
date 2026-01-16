import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Add ArrowRight to the imports from lucide-react
import { Image as ImageIcon, Camera, MapPin, Mail, Phone, Clock, Save, RotateCcw, ArrowRight } from 'lucide-react';
import SectionHeader from '../SectionHeader';

const SettingsProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: 'Maboneng Textiles',
    description: 'Authentic South African fabrics and contemporary clothing designs. Every piece is hand-stitched in the heart of Johannesburg.',
    email: 'hello@maboneng.co.za',
    phone: '+27 11 555 0123',
    address: '144 Fox Street, Maboneng, Johannesburg, 2001',
    hours: 'Mon-Fri: 09:00 - 18:00, Sat: 10:00 - 15:00'
  });

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Artisan Identity" 
        sub="Manage how your workshop appears to the neighborhood." 
        icon={ImageIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 space-y-10">
            {/* Visual Assets */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Visual Exhibition</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-gray-400">Workshop Emblem (Logo)</label>
                  <div className="relative w-32 h-32 group">
                    <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-[2.5rem] border-4 border-jozi-cream shadow-xl" />
                    <button className="absolute inset-0 bg-jozi-dark/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] flex items-center justify-center text-white transition-all">
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[9px] font-black uppercase text-gray-400">Gallery Banner</label>
                  <div className="relative h-32 group">
                    <div className="w-full h-full bg-jozi-forest rounded-[2rem] overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-30" />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <div className="flex items-center space-x-2 bg-jozi-dark/60 px-4 py-2 rounded-xl">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Banner</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Descriptive Info */}
            <div className="space-y-6 pt-4 border-t border-gray-50">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">The Artisan Story</h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Business Name</label>
                  <input 
                    type="text" 
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Workshop Description</label>
                  <textarea 
                    rows={4} 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-50 rounded-[2.5rem] px-8 py-6 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none" 
                  />
                </div>
              </div>
            </div>

            {/* Contact Logic */}
            <div className="space-y-6 pt-4 border-t border-gray-50">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Dispatch & Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={formData.email} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Workshop Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={formData.phone} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Workshop Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.address} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Operating Protocol (Hours)</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.hours} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 shadow-soft border border-gray-100 space-y-6">
            <h3 className="text-lg font-black text-jozi-forest uppercase tracking-tight">Sync Changes</h3>
            <p className="text-xs text-gray-400 font-medium italic">Updates to workshop name or description go live across the platform immediately.</p>
            <div className="space-y-3">
              <button className="w-full py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all flex items-center justify-center group">
                <Save className="w-4 h-4 mr-2" /> Commit Profile
              </button>
              <button className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center">
                <RotateCcw className="w-4 h-4 mr-2" /> Discard Draft
              </button>
            </div>
          </div>

          <div className="bg-jozi-dark p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-black">Need a Refresh?</h4>
              <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium">Our platform designers can help refine your workshop's digital presence. Professional photography cycles are available monthly.</p>
              <button className="text-xs font-black text-jozi-gold hover:underline flex items-center">
                Contact Design Hub <ArrowRight className="ml-2 w-3 h-3" />
              </button>
            </div>
            <ImageIcon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;