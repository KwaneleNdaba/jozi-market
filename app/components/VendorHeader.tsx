import React from 'react';
import { Bell, Plus } from 'lucide-react';

interface VendorHeaderProps {
  title: string;
  vendorName: string;
  onUploadClick?: () => void;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ title, vendorName, onUploadClick }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="text-left space-y-1">
        <h1 className="text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
          {title}
        </h1>
        <p className="text-gray-400 font-medium italic">Managing {vendorName} Growth</p>
      </div>
      <div className="flex gap-4">
        <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-jozi-forest transition-all">
          <Bell className="w-6 h-6" />
        </button>
        <button
          onClick={onUploadClick}
          className="bg-jozi-gold text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-jozi-gold/20 hover:scale-105 transition-all flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Upload Piece
        </button>
      </div>
    </header>
  );
};

export default VendorHeader;