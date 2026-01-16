import React from 'react';
import { motion } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import ArtisanOverview from '../../components/vendor/ArtisanOverview';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth',
  status: 'Open',
  verification: 'Verified',
  deliveryMode: 'Platform-Delivery',
  stockHealth: 'Low Stock (2)'
};

const VendorDashboardV2: React.FC = () => {
  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Artisan Cockpit" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => alert('Opening Piece Upload...')} 
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ArtisanOverview vendor={VENDOR_PROFILE} />
      </motion.div>
    </div>
  );
};

export default VendorDashboardV2;