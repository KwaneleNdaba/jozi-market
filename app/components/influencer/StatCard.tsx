import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  val: string;
  trend: string;
  icon: any;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, val, trend, icon: Icon, color, bg }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-4xl shadow-soft border border-jozi-forest/5 text-left group transition-all relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
            {trend}
          </span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 leading-none">{label}</p>
        <h3 className="text-4xl font-black mt-3 text-jozi-forest tracking-tighter">{val}</h3>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-jozi-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
};

export default StatCard;