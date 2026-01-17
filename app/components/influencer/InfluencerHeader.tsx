import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';

interface InfluencerHeaderProps {
  title: string;
  profile: any;
}

const InfluencerHeader: React.FC<InfluencerHeaderProps> = ({ title, profile }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="text-left space-y-1">
        <h1 className="text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
          {title}
        </h1>
        <p className="text-gray-400 font-medium italic">Creator Hub Protocol • {profile.handle}</p>
      </div>
      
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <div className="relative grow md:grow-0 hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Find campaigns..." 
            className="w-full md:w-64 bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-jozi-gold/20 shadow-soft" 
          />
        </div>
        <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft text-gray-400 hover:text-jozi-forest transition-all relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-3 right-3 w-3 h-3 bg-jozi-gold rounded-full border-2 border-white shadow-sm" />
        </button>
        <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2 text-jozi-gold" /> Upload Content
        </button>
      </div>
    </header>
  );
};

export default InfluencerHeader;