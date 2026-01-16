import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Wand2, 
  Globe, 
  Zap, 
  AlertTriangle, 
  Users, 
  Terminal, 
  Truck, 
  Sparkles, 
  Percent, 
  ArrowRight,
  Target,
  BarChart3,
  Flame,
  BrainCircuit,
  PieChart as PieIcon,
  Search,
  ChevronRight,
  Tag,
  History,
  CheckCircle2,
  X,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line, AreaChart
} from 'recharts';
import SectionHeader from '../SectionHeader';
import StatusBadge from '../StatusBadge';

// --- MOCK DATA ---
const REVENUE_FORECAST_DATA = [
  { name: 'Aug', actual: 38000, forecast: 38000 },
  { name: 'Sep', actual: 42850, forecast: 41000 },
  { name: 'Oct', actual: null, forecast: 51000 },
  { name: 'Nov', actual: null, forecast: 64000 },
  { name: 'Dec', actual: null, forecast: 88000 },
];

const PRICING_SUGGESTIONS = [
  { id: 'p1', name: 'Shweshwe Evening Dress', current: 1250, suggested: 1395, uplift: '+12% Margin', confidence: 94, reason: 'High demand in Sandton region' },
  { id: 'p2', name: 'Zebu Leather Wallet', current: 450, suggested: 425, uplift: '+18% Volume', confidence: 88, reason: 'Price elastic category shift' },
  { id: 'p3', name: 'Beaded Silk Scarf', current: 750, suggested: 810, uplift: '+8% Margin', confidence: 91, reason: 'Artisan scarcity index rose' },
];

const CUSTOMER_SEGMENTS = [
  { name: 'Loyal Neighbors', value: 42, color: '#1B5E52' },
  { name: 'New Seekers', value: 58, color: '#C7A16E' },
];

const TRENDING_OPPORTUNITIES = [
  { id: 'o1', title: 'Stock-out Risk: Indigo Silk', desc: 'Predicting empty vault in 3 days based on current velocity.', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', action: 'Restock' },
  { id: 'o2', title: 'High CTR: Veld Boots', desc: 'Listing is outperforming market average by 4.2x. Increase visibility.', icon: Sparkles, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10', action: 'Boost' },
  { id: 'o3', title: 'Abandoned Cart Spike', desc: '14 Neighbors left carts in the last 24h. Recommend R50 voucher.', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', action: 'Send Promo' },
];

const AIStatCard = ({ label, val, trend, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-jozi-forest/5 text-left group transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{label}</p>
    <h3 className="text-3xl font-black mt-2 text-jozi-forest">{val}</h3>
  </motion.div>
);

const ArtisanIntelligence: React.FC = () => {
  const [simulationValue, setSimulationValue] = useState(15);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const projectedRevenue = useMemo(() => 51000 * (1 + (simulationValue * 1.8) / 100), [simulationValue]);

  return (
    <div className="space-y-10 text-left relative">
      {/* AI Assistant FAB */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-jozi-dark text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-all group border-4 border-jozi-gold"
        >
          <BrainCircuit className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-jozi-gold rounded-full flex items-center justify-center text-[10px] font-black text-jozi-dark border-2 border-white animate-bounce">1</span>
        </button>
      </div>

      <SectionHeader 
        title="Predictive Models" 
        sub="Gemini-powered forecasting and strategic interventions for artisan growth." 
        icon={BrainCircuit}
      />

      {/* AI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AIStatCard label="Model Confidence" val="94.2%" trend="+2.1%" icon={ShieldCheck} color="text-emerald-500" />
        <AIStatCard label="Predicted Cycle GMV" val="R62,400" trend="+14.8%" icon={TrendingUp} color="text-jozi-gold" />
        <AIStatCard label="Market Sentiment" val="Strong" icon={Activity} color="text-blue-500" />
        <AIStatCard label="Growth Opportunities" val="4" trend="New" icon={Wand2} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Commercial Oracle Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100">
          <SectionHeader title="Revenue Trajectory" sub="Actual performance vs algorithmic forecast for the holiday quarter." icon={Globe} />
          <div className="h-[400px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={REVENUE_FORECAST_DATA}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="forecast" name="AI Forecast" stroke="#C7A16E" strokeWidth={4} strokeDasharray="8 4" fill="url(#colorForecast)" />
                <Line type="monotone" dataKey="actual" name="Actual GMV" stroke="#1B5E52" strokeWidth={5} dot={{ r: 6, fill: '#1B5E52' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5 flex items-start space-x-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-jozi-gold"><Zap className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
              "We predict a <span className="text-jozi-forest font-bold underline underline-offset-4 decoration-jozi-gold">significant surge</span> in Home Decor demand during November Week 2. Recommend starting your 'Heritage Week' campaign on Oct 28th."
            </p>
          </div>
        </div>

        {/* Operational Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="bg-jozi-dark p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden shadow-2xl group">
            <div className="relative z-10 space-y-6 text-left">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/10 rounded-2xl text-jozi-gold"><AlertTriangle className="w-6 h-6" /></div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">Market Nerves</h3>
              </div>
              <div className="space-y-4">
                {TRENDING_OPPORTUNITIES.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/opp">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl ${opp.bg} ${opp.color}`}><opp.icon className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[120px]">{opp.title}</p>
                        <p className="text-[10px] opacity-50 truncate max-w-[150px]">{opp.desc}</p>
                      </div>
                    </div>
                    <button className="bg-white text-jozi-dark px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">
                      {opp.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 text-left flex flex-col justify-between min-h-[400px]">
            <SectionHeader title="Neighbor Loyalty" sub="Repeat vs One-time market seekers." icon={Users} />
            <div className="h-[200px] my-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CUSTOMER_SEGMENTS} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                    {CUSTOMER_SEGMENTS.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {CUSTOMER_SEGMENTS.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-400 uppercase tracking-widest">{c.name}</span>
                  </div>
                  <span className="text-jozi-forest">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pricing Matrix */}
      <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 text-left">
         <SectionHeader 
          title="Optimal Pricing Matrix" 
          sub="Algorithmic suggestions to maximize profit based on competitor scans and seasonality." 
          icon={Percent} 
          action={
            <button className="bg-jozi-forest text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all">Apply All Updates</button>
          }
        />
        <div className="overflow-x-auto mt-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Treasure Item</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Current</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">AI Recommended</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Predicted Uplift</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {PRICING_SUGGESTIONS.map((item) => (
                 <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6">
                       <p className="font-black text-jozi-forest text-sm">{item.name}</p>
                       <p className="text-[10px] text-gray-400 font-medium italic mt-1">{item.reason}</p>
                    </td>
                    <td className="py-6 text-center font-bold text-gray-300">R{item.current}</td>
                    <td className="py-6 text-center">
                       <span className="bg-jozi-gold text-jozi-dark px-4 py-2 rounded-xl font-black text-sm shadow-sm group-hover:scale-105 transition-transform inline-block">
                         R{item.suggested}
                       </span>
                    </td>
                    <td className="py-6 text-center">
                       <span className="text-emerald-500 font-black text-sm">{item.uplift}</span>
                    </td>
                    <td className="py-6 text-right">
                       <div className="flex items-center justify-end space-x-2">
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }} className="h-full bg-jozi-forest" />
                          </div>
                          <span className="text-[10px] font-black text-jozi-forest">{item.confidence}%</span>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* What-If Simulator */}
        <div className="bg-white p-12 rounded-[4rem] shadow-soft border border-jozi-forest/5 text-left flex flex-col justify-between">
          <div className="space-y-8">
            <div className="inline-flex items-center bg-jozi-forest/5 px-4 py-2 rounded-full text-jozi-forest">
              <Terminal className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Growth Sandbox</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-jozi-dark tracking-tighter leading-none uppercase">The "What-If" <br /><span className="text-jozi-gold">Simulator.</span></h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              Adjust your workshop variables to see how our model predicts the upcoming volume impact.
            </p>
            <div className="space-y-8 py-6">
              <div className="space-y-4">
                <div className="flex justify-between font-black uppercase text-[10px] text-gray-400">
                  <span>Discount Multiplier</span>
                  <span className="text-jozi-forest font-black">{simulationValue}% OFF</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="5"
                  value={simulationValue} onChange={(e) => setSimulationValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-jozi-gold" 
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Predicted GMV</p>
                    <p className="text-3xl font-black text-jozi-forest">R{Math.round(projectedRevenue).toLocaleString()}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Market Coverage</p>
                    <p className="text-3xl font-black text-jozi-gold">+{Math.round(simulationValue * 1.5)}%</p>
                 </div>
              </div>
            </div>
          </div>
          <button className="w-full py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20">
            Run Campaign Analysis
          </button>
        </div>

        {/* AI Chat Drawer / Conversation */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 text-left flex flex-col h-full overflow-hidden relative">
           <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark shadow-xl">
                 <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-xl font-black tracking-tight uppercase">Artisan AI</h3>
                 <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Active & Learning</p>
              </div>
           </div>
           
           <div className="flex-grow space-y-6 overflow-y-auto mb-8 pr-2 scrollbar-hide">
              <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none max-w-[85%]">
                 <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                    "I've analyzed your storefront traffic. Users from <b>Sandton</b> are viewing your 'Evening Dress' but dropping off before checkout. Would you like me to generate a 10% discount for this specific zone?"
                 </p>
              </div>
              <div className="bg-jozi-forest p-5 rounded-3xl rounded-tr-none max-w-[85%] ml-auto text-white">
                 <p className="text-sm font-bold">Yes, please apply that discount to the next 50 seekers.</p>
              </div>
           </div>

           <div className="relative">
              <input type="text" placeholder="Ask your artisan strategist..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-jozi-gold/30" />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-jozi-gold rounded-xl text-jozi-dark hover:scale-110 transition-transform">
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* AI Chat Modal (keeping for FAB consistency) */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              className="relative bg-white w-full max-w-lg h-full sm:h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden text-left"
            >
              <div className="bg-jozi-dark p-8 text-white flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark shadow-xl">
                       <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black tracking-tight">Artisan AI</h3>
                       <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Active & Learning</p>
                    </div>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                 <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-gray-100 p-5 rounded-[2rem] rounded-bl-none text-sm font-medium text-gray-600 leading-relaxed">
                       Hello! I've been analyzing your vault performance. Would you like to know which product to prioritize for next week's marketing cycle?
                    </div>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2 ml-2">Artisan AI • 2m ago</span>
                 </div>

                 <div className="flex flex-col items-end ml-auto max-w-[85%]">
                    <div className="bg-jozi-forest p-5 rounded-[2rem] rounded-br-none text-sm font-medium text-white shadow-lg">
                       Yes, show me the demand predictions for the shweshwe collection.
                    </div>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2 mr-2">You • Just now</span>
                 </div>

                 <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-gray-100 p-5 rounded-[2rem] rounded-bl-none text-sm font-medium text-gray-600 leading-relaxed">
                       Your "Evening Dress" is showing a <span className="font-black text-jozi-forest">42% demand increase</span> forecast for Gauteng Central. I recommend applying the 12% price optimization suggested in your Command Center.
                    </div>
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between w-full shadow-sm">
                       <span className="text-xs font-bold">Apply Pricing?</span>
                       <button className="text-[10px] font-black text-jozi-gold uppercase hover:underline" onClick={() => setIsChatOpen(false)}>Apply Now</button>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-100">
                 <div className="flex items-center space-x-3 bg-gray-50 rounded-[2rem] p-2 pl-6">
                    <input 
                      type="text" 
                      placeholder="Ask the Oracle..." 
                      className="bg-transparent border-none outline-none flex-grow font-bold text-sm text-jozi-dark"
                    />
                    <button className="p-4 bg-jozi-gold text-jozi-dark rounded-full shadow-lg hover:scale-105 transition-all">
                       <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtisanIntelligence;