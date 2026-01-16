import React from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronDown, 
  RotateCcw 
} from 'lucide-react';

const LedgerFilters: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search ledger..." 
          className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold outline-none transition-all"
        />
      </div>

      {/* Date Range Selector */}
      <div className="relative w-full md:w-48 group">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select className="w-full bg-gray-50 border border-transparent rounded-2xl pl-11 pr-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer group-hover:bg-gray-100 transition-colors">
          <option>Last 30 Days</option>
          <option>Current Cycle</option>
          <option>Last Quarter</option>
          <option>Fiscal Year</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
      </div>

      {/* Category Filter */}
      <div className="relative w-full md:w-48 group">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select className="w-full bg-gray-50 border border-transparent rounded-2xl pl-11 pr-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer group-hover:bg-gray-100 transition-colors">
          <option>All Types</option>
          <option>Profit (Sales)</option>
          <option>Withdrawals</option>
          <option>Contributions</option>
          <option>Commission</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
      </div>

      {/* Reset View */}
      <button 
        onClick={() => {}}
        className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-colors shadow-sm"
        title="Reset Filters"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LedgerFilters;
