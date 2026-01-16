import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, MessageSquare, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import SectionHeader from '../SectionHeader';

interface ToggleProps {
  label: string;
  desc: string;
  isEnabled: boolean;
  onToggle: () => void;
  icon: any;
}

const NotificationToggle = ({ label, desc, isEnabled, onToggle, icon: Icon }: ToggleProps) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 hover:border-jozi-forest/5 transition-all group">
    <div className="flex items-center space-x-5">
      <div className={`p-3 rounded-2xl transition-colors ${isEnabled ? 'bg-jozi-forest/5 text-jozi-forest' : 'bg-gray-100 text-gray-300'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-left">
        <p className="font-black text-sm text-jozi-dark">{label}</p>
        <p className="text-xs text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isEnabled ? 'translate-x-7' : 'translate-x-1'} shadow-md`} />
    </button>
  </div>
);

const SettingsNotifications: React.FC = () => {
  const [prefs, setPrefs] = useState({
    email_orders: true,
    email_payouts: true,
    push_stock: true,
    sms_payout: false,
    ai_tips: true,
    social_reach: false
  });

  const toggle = (key: keyof typeof prefs) => setPrefs({...prefs, [key]: !prefs[key]});

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Attention Protocol" 
        sub="Control how and when we update your workshop on market activity." 
        icon={Bell}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-12">
           <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Economic Alerts</h4>
             <div className="space-y-4">
               <NotificationToggle 
                  label="Order Dispatches" 
                  desc="Real-time alerts when a neighbor places an order." 
                  isEnabled={prefs.email_orders} 
                  onToggle={() => toggle('email_orders')} 
                  icon={Zap}
                />
                <NotificationToggle 
                  label="Capital Ledger Updates" 
                  desc="Confirmations of successful payouts and deposits." 
                  isEnabled={prefs.email_payouts} 
                  onToggle={() => toggle('email_payouts')} 
                  icon={CreditCard}
                />
                <NotificationToggle 
                  label="SMS Verification" 
                  desc="One-time passwords for critical payout changes." 
                  isEnabled={prefs.sms_payout} 
                  onToggle={() => toggle('sms_payout')} 
                  icon={MessageSquare}
                />
             </div>
           </div>

           <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Inventory Management</h4>
             <div className="space-y-4">
                <NotificationToggle 
                  label="Critical Stock Alarms" 
                  desc="Immediate mobile push when pieces drop below threshold." 
                  isEnabled={prefs.push_stock} 
                  onToggle={() => toggle('push_stock')} 
                  icon={AlertTriangle}
                />
             </div>
           </div>
        </div>

        <div className="space-y-12">
           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Strategic Intelligence</h4>
              <div className="space-y-4">
                <NotificationToggle 
                    label="AI Growth Logic" 
                    desc="Algorithmic tips for pricing and visibility boosts." 
                    isEnabled={prefs.ai_tips} 
                    onToggle={() => toggle('ai_tips')} 
                    icon={Sparkles}
                  />
                  <NotificationToggle 
                    label="Neighborhood Sentiment" 
                    desc="Weekly digest of customer reviews and feedback." 
                    isEnabled={prefs.social_reach} 
                    onToggle={() => toggle('social_reach')} 
                    icon={Users}
                  />
              </div>
           </div>

           <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <h4 className="text-xl font-black uppercase tracking-tight">Do Not Disturb</h4>
                 <p className="text-sm text-jozi-cream/60 font-medium">Temporarily pause all non-order-related notifications while you're in production cycles.</p>
                 <div className="pt-4">
                    <button className="bg-white text-jozi-dark px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
                      Initialize Silence
                    </button>
                 </div>
              </div>
              <Bell className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
           </div>
        </div>
      </div>
    </div>
  );
};

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default SettingsNotifications;