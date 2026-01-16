import React, { useState } from 'react';
import VendorHeader from '../../components/VendorHeader';
import { 
  ArrowUpRight, 
  Download, 
  Printer, 
  FileText,
  Plus
} from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import LedgerSummary from '../../components/vendor/ledger/LedgerSummary';
import LedgerTable from '../../components/vendor/ledger/LedgerTable';
import LedgerFilters from '../../components/vendor/ledger/LedgerFilters';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorWalletPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`${format} Ledger Exported Successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Capital Ledger" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => alert('Opening Capital Inflow Form...')} 
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => alert('Requesting Withdrawal...')} className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-jozi-dark transition-all flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Initiate Withdrawal
          </button>
          <button onClick={() => alert('Opening Capital Top-up...')} className="bg-white border border-jozi-forest/10 text-jozi-forest px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-cream transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Working Capital
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => handleExport('CSV')} disabled={isExporting} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-jozi-forest shadow-sm transition-all"><Download className="w-5 h-5" /></button>
          <button onClick={() => handleExport('PDF')} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-jozi-forest shadow-sm transition-all"><Printer className="w-5 h-5" /></button>
        </div>
      </div>

      <LedgerSummary />

      <div className="bg-white rounded-[3.5rem] p-8 lg:p-12 shadow-soft border border-gray-100 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <SectionHeader title="Transaction Registry" sub="Chronological audit of cash movements." icon={FileText} />
          <LedgerFilters />
        </div>
        <LedgerTable />
      </div>
    </div>
  );
};

export default VendorWalletPage;