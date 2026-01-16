import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Mail, Smartphone, MessageSquare, 
  ShoppingBag, Tag, AlertTriangle, Wallet, BrainCircuit,
  Save, RotateCcw, ShieldCheck, Zap
} from 'lucide-react';
import SectionHeader from '../../SectionHeader';

interface ToggleProps {
  label: string;
  desc: string;
  isEnabled: boolean;
  onToggle: () => void;
  icon: any;
}

const SettingsToggle = ({ label, desc, isEnabled, onToggle, icon: Icon }: ToggleProps) => (
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

const NotificationSettings: React.FC = () => {
  const [prefs, setPrefs] = useState({
    type_orders: true,
    type_promos: true,
    type_stock: true,
    type_payout: true,
    type_ai: true,
    chan_email: true,
    chan_push: true,
    chan_sms: false
  });

  const toggle = (key: keyof typeof prefs) => setPrefs({...prefs, [key]: !prefs[key]});

  const handleSave = () => {
    alert('Global alert preferences updated.');
  };

  return (
    <div className="space-y-12 text-left">
      <SectionHeader 
        title="Alert Governance" 
        sub="Configure which commercial and operational events trigger notifications." 
        icon={Bell}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Logic Layer */}
        <div className="space-y-8">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Event Triggers</h4>
           <div className="space-y-4">
             <SettingsToggle 
                label="Commercial Manifests" 
                desc="New order logs, returns, and fulfillment status updates." 
                isEnabled={prefs.type_orders} 
                onToggle={() => toggle('type_orders')} 
                icon={ShoppingBag}
              />
              <SettingsToggle 
                label="Vault Alarms" 
                desc="Alerts for low SKU balances and restock suggestions." 
                isEnabled={prefs.type_stock} 
                onToggle={() => toggle('type_stock')} 
                icon={AlertTriangle}
              />
              <SettingsToggle 
                label="Capital Payouts" 
                desc="Notifications for successful bank settlements and ledger entries." 
                isEnabled={prefs.type_payout} 
                onToggle={() => toggle('type_payout')} 
                icon={Wallet}
              />
              <SettingsToggle 
                label="Marketing Yield" 
                desc="Voucher capacity limits and promotion performance alerts." 
                isEnabled={prefs.type_promos} 
                onToggle={() => toggle('type_promos')} 
                icon={Tag}
              />
              <SettingsToggle 
                label="Artisan Intelligence" 
                desc="Strategic AI suggestions for pricing and seasonal trends." 
                isEnabled={prefs.type_ai} 
                onToggle={() => toggle('type_ai')} 
                icon={BrainCircuit}
              />
           </div>
        </div>

        {/* Channel Layer */}
        <div className="space-y-8">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Delivery Channels</h4>
           <div className="space-y-4">
              <SettingsToggle 
                label="Mobile Push" 
                desc="Immediate alerts directly to your registered device." 
                isEnabled={prefs.chan_push} 
                onToggle={() => toggle('chan_push')} 
                icon={Smartphone}
              />
              <SettingsToggle 
                label="Secure Email" 
                desc="Detailed summaries sent to hello@maboneng.co.za." 
                isEnabled={prefs.chan_email} 
                onToggle={() => toggle('chan_email')} 
                icon={Mail}
              />
              <SettingsToggle 
                label="Priority SMS" 
                desc="One-time codes and critical system alerts via mobile." 
                isEnabled={prefs.chan_sms} 
                onToggle={() => toggle('chan_sms')} 
                icon={MessageSquare}
              />
           </div>

           {/* Save Card */}
           <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group mt-12">
              <div className="relative z-10 space-y-4">
                 <h4 className="text-xl font-black uppercase tracking-tight leading-none">Apply Hub <br />Preferences</h4>
                 <p className="text-sm text-jozi-cream/50 font-medium leading-relaxed italic">Changes to alert logic take up to 10 minutes to propagate across platform nodes.</p>
                 <div className="flex gap-3 pt-4">
                    <button 
                      onClick={handleSave}
                      className="bg-jozi-gold text-jozi-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                    >
                      Commit Logic
                    </button>
                    <button className="bg-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                 </div>
              </div>
              <Zap className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700 text-jozi-gold" />
           </div>

           <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-start space-x-5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
              <div className="space-y-1">
                 <h5 className="font-black text-emerald-900 text-sm uppercase tracking-tight">Security Protocol</h5>
                 <p className="text-xs text-emerald-800 font-medium leading-relaxed opacity-80">Payout and Security alerts cannot be fully disabled as per platform compliance rules.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;