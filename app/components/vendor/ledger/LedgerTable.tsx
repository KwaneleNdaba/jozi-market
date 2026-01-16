import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownLeft,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import StatusBadge from '../../StatusBadge';

// --- MOCK DATA ---
const MOCK_TRANSACTIONS = [
  { 
    id: 'TRX-9011', 
    date: '15 Oct 2024, 14:30', 
    description: 'Sale Profit: ORD-2041 (Shweshwe Dress)', 
    type: 'Profit', 
    debit: 0, 
    credit: 1187.50, 
    balance: 32450.00,
    status: 'Completed',
    details: { orderId: 'ORD-2041', fee: '5%', handling: 'R75' }
  },
  { 
    id: 'TRX-9010', 
    date: '14 Oct 2024, 09:15', 
    description: 'Capital Withdrawal: Bank Settlement', 
    type: 'Withdrawal', 
    debit: 12000.00, 
    credit: 0, 
    balance: 31262.50,
    status: 'Completed',
    details: { destination: 'Standard Bank ••• 9901', ref: 'JOZI-WDR-Oct' }
  },
  { 
    id: 'TRX-9009', 
    date: '12 Oct 2024, 18:22', 
    description: 'Initial Capital Contribution', 
    type: 'Contribution', 
    debit: 0, 
    credit: 15000.00, 
    balance: 43262.50,
    status: 'Completed',
    details: { method: 'Instant EFT', verified: true }
  },
  { 
    id: 'TRX-9008', 
    date: '10 Oct 2024, 11:45', 
    description: 'Commission Surcharge: Marketing Spotlight', 
    type: 'Commission', 
    debit: 500.00, 
    credit: 0, 
    balance: 28262.50,
    status: 'Completed',
    details: { campaign: 'Spring Launch Spotlight', duration: '7 Days' }
  },
  { 
    id: 'TRX-9007', 
    date: '08 Oct 2024, 09:00', 
    description: 'Tax Adjustment: Sept VAT Cycle', 
    type: 'Adjustment', 
    debit: 2150.00, 
    credit: 0, 
    balance: 28762.50,
    status: 'Completed',
    details: { type: 'VAT Output', period: 'Sept 2024' }
  },
];

const LedgerTable: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Profit': return 'text-emerald-500 bg-emerald-50';
      case 'Withdrawal': return 'text-rose-500 bg-rose-50';
      case 'Contribution': return 'text-blue-500 bg-blue-50';
      case 'Commission': return 'text-orange-500 bg-orange-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="overflow-x-auto text-left">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] w-12">Detail</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Transaction / Date</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Category</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Debit (Out)</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Credit (In)</th>
            <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] text-right">Ledger Balance</th>
            <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Ops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_TRANSACTIONS.map((trx) => {
            const isExpanded = expandedRows.includes(trx.id);
            return (
              <React.Fragment key={trx.id}>
                <tr className={`group transition-all ${isExpanded ? 'bg-jozi-cream/20' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-6">
                    <button 
                      onClick={() => toggleRow(trx.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-jozi-forest text-white' : 'bg-gray-50 text-gray-300 group-hover:text-jozi-forest group-hover:bg-white'}`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-6">
                    <div className="space-y-1">
                      <p className="font-black text-jozi-forest text-sm leading-tight group-hover:text-jozi-gold transition-colors">{trx.description}</p>
                      <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         <Clock className="w-3 h-3 mr-1 opacity-40" /> {trx.date}
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-transparent ${getTypeStyle(trx.type)}`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    {trx.debit > 0 ? (
                      <div className="flex items-center justify-end text-rose-500 font-black">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>R{trx.debit.toLocaleString()}</span>
                      </div>
                    ) : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-6 text-right">
                    {trx.credit > 0 ? (
                      <div className="flex items-center justify-end text-emerald-600 font-black">
                        <ArrowDownLeft className="w-3 h-3 mr-1" />
                        <span>R{trx.credit.toLocaleString()}</span>
                      </div>
                    ) : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-6 text-right font-black text-jozi-forest text-lg">
                    R{trx.balance.toLocaleString()}
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-forest shadow-sm transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-gray-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expandable Details Row */}
                <AnimatePresence>
                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0 border-none">
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/30"
                        >
                          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                             <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-jozi-gold border-l-4 border-jozi-gold pl-4">Audit Metadata</h5>
                                <div className="space-y-3">
                                   <div className="flex justify-between text-xs font-medium">
                                      <span className="text-gray-400">Transaction ID</span>
                                      <span className="font-mono text-jozi-forest font-bold">{trx.id}</span>
                                   </div>
                                   <div className="flex justify-between text-xs font-medium">
                                      <span className="text-gray-400">Platform Timestamp</span>
                                      <span className="text-jozi-forest font-bold">RT-884-9922</span>
                                   </div>
                                   <div className="flex justify-between text-xs font-medium">
                                      <span className="text-gray-400">Governance State</span>
                                      <StatusBadge status="Verified" className="bg-emerald-500 text-white" />
                                   </div>
                                </div>
                             </div>

                             <div className="md:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-jozi-gold border-l-4 border-jozi-gold pl-4">Transaction Payload</h5>
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-8">
                                   {Object.entries(trx.details).map(([key, val]) => (
                                     <div key={key}>
                                        <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        <p className="text-sm font-bold text-jozi-forest truncate">{val.toString()}</p>
                                     </div>
                                   ))}
                                   <div className="flex items-end justify-end col-span-2 pt-4">
                                      <button className="flex items-center text-[10px] font-black text-jozi-forest uppercase tracking-widest hover:text-jozi-gold transition-colors">
                                         Open Linked Asset <ExternalLink className="ml-2 w-3.5 h-3.5" />
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerTable;
