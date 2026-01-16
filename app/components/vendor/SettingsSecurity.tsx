import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, Smartphone, Activity, ArrowUpRight, History } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import StatusBadge from '../StatusBadge';

const LOGIN_HISTORY = [
  { device: 'iPhone 15 Pro', location: 'Johannesburg, ZA', date: 'Oct 15, 14:30', ip: '102.221.xx.xx' },
  { device: 'MacBook Air M2', location: 'Sandton, ZA', date: 'Oct 14, 09:12', ip: '102.221.xx.xx' },
  { device: 'Chrome on Windows', location: 'Pretoria, ZA', date: 'Oct 12, 18:45', ip: '105.186.xx.xx' },
];

const SettingsSecurity: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Security Protocol" 
        sub="Manage access control and verify digital footprint safety." 
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Change Password */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
            <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-8">Refine Cipher</h3>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type={showPass ? 'text' : 'password'} 
                      className="w-full bg-gray-50 rounded-2xl pl-12 pr-12 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">New Cipher</label>
                  <input type="password" placeholder="Min 8 characters" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Repeat New Cipher</label>
                  <input type="password" placeholder="Verify entry" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none" />
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-jozi-forest text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-lg">
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Access Logs */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Governance Ledger</h3>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><History className="w-5 h-5" /></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-widest">Device & Browser</th>
                    <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-widest">Zone</th>
                    <th className="pb-5 text-[10px] font-black uppercase text-gray-300 tracking-widest text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {LOGIN_HISTORY.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center space-x-4">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="font-black text-jozi-forest text-sm">{log.device}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{log.ip}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-xs font-bold text-gray-500">{log.location}</span>
                      </td>
                      <td className="py-5 text-right">
                        <span className="text-[10px] font-black uppercase text-gray-400">{log.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] hover:text-jozi-forest transition-colors">
              Terminate All Active Sessions
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* 2FA Card */}
          <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl group">
            <Smartphone className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black uppercase tracking-tight">Two-Factor Auth</h3>
                 <StatusBadge status={is2FAEnabled ? 'Active' : 'Inactive'} className={is2FAEnabled ? 'bg-emerald-500 text-white border-white' : 'bg-red-500 text-white border-white'} />
              </div>
              <p className="text-sm text-jozi-cream/60 font-medium leading-relaxed">Secure your capital with mandatory mobile verification for every login and payout request.</p>
              <button 
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all"
              >
                {is2FAEnabled ? 'Disable Protocol' : 'Initialize Protocol'}
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-soft space-y-6 text-left">
            <h4 className="font-black text-sm text-jozi-dark uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Security Tip</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">"Never share your Jozi Workshop cipher. Our platform stewards will never ask for your password via WhatsApp or email."</p>
            <button className="text-[10px] font-black text-jozi-gold uppercase hover:underline flex items-center">
              Global Compliance <ArrowUpRight className="ml-1 w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;