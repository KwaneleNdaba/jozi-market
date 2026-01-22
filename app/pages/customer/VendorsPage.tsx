'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Store, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getActiveVendorsAction } from '@/app/actions/auth/auth';
import { IVendorWithApplication } from '@/interfaces/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';

interface VendorDisplay {
  id: string;
  name: string;
  rating: number;
  image: string;
  location: string;
  description: string;
  productCount?: number;
}

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showError } = useToast();

  // Fetch active vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getActiveVendorsAction();
        
        if (response.error || !response.data) {
          showError(response.message || 'Failed to load vendors');
          setVendors([]);
          return;
        }

        // Transform backend data to frontend format
        const transformedVendors: VendorDisplay[] = response.data.map((vendor: IVendorWithApplication) => {
          // Get vendor name (prefer shopName, fallback to fullName)
          const vendorName = vendor.vendorApplication?.shopName || vendor.fullName || 'Unknown Vendor';
          
          // Get vendor image (prefer logo, fallback to profileUrl, fallback to placeholder)
          let vendorImage = '/placeholder-vendor.jpg';
          if (vendor.vendorApplication?.files?.logoUrl) {
            vendorImage = vendor.vendorApplication.files.logoUrl;
          } else if (vendor.profileUrl) {
            vendorImage = vendor.profileUrl;
          }

          // Get location from address
          const location = vendor.vendorApplication?.address?.city || 
                          vendor.vendorApplication?.address?.street?.split(',')[0] || 
                          'Johannesburg';

          // Get description
          const description = vendor.vendorApplication?.description || 
                             vendor.vendorApplication?.tagline || 
                             'A local artisan bringing unique products to Jozi Market.';

          // Default rating (could be calculated from reviews in the future)
          const rating = 4.5;

          return {
            id: vendor.id || '',
            name: vendorName,
            rating,
            image: vendorImage,
            location,
            description,
            productCount: vendor.productCount || 0,
          };
        });

        setVendors(transformedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        showError('Failed to load vendors. Please try again later.');
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [showError]);

  // Filter vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;

    const query = searchQuery.toLowerCase();
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query) ||
      vendor.location.toLowerCase().includes(query) ||
      vendor.description.toLowerCase().includes(query)
    );
  }, [vendors, searchQuery]);
  return (
    <div className="min-h-screen bg-jozi-cream pb-24">
      {/* Hero Header */}
      <section className="bg-jozi-forest py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-jozi-gold mb-4">
              <Store className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">The Artisan Collective</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
              MEET THE <br />
              <span className="text-jozi-gold">VISIONARIES</span>
            </h1>
            <p className="text-jozi-cream/70 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Discover the creative hearts of Johannesburg. From Maboneng textiles to Soweto gold, 
              support the makers defining our modern heritage.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-jozi-gold opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-jozi-bright opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Filter & Search Bar */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-4xl shadow-xl border border-jozi-forest/5 flex flex-col md:flex-row items-center gap-6">
          <div className="grow flex items-center bg-jozi-cream rounded-2xl px-6 py-4 w-full">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Find an artisan or workshop..." 
              className="bg-transparent border-none outline-none text-jozi-forest font-bold w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex items-center space-x-2 bg-jozi-cream px-6 py-4 rounded-2xl font-black text-jozi-forest hover:bg-jozi-forest/5 transition-all grow md:grow-0">
              <MapPin className="w-5 h-5 text-jozi-gold" />
              <span>Joburg Central</span>
            </button>
            <button className="flex items-center space-x-2 bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-jozi-forest/20 hover:scale-105 transition-all">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="container mx-auto px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Artisans...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-jozi-forest font-black text-lg mb-2">
              {searchQuery ? 'No vendors found' : 'No vendors available'}
            </p>
            <p className="text-gray-400 text-sm font-medium">
              {searchQuery ? 'Try adjusting your search query' : 'Check back later for new artisans'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-5xl overflow-hidden border border-jozi-forest/5 shadow-soft hover:shadow-2xl transition-all flex flex-col"
            >
              {/* Cover/Accent */}
              <div className="h-40 bg-jozi-forest/5 relative">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-jozi-forest/10 flex items-center space-x-1 shadow-sm">
                    <Star className="w-4 h-4 text-jozi-gold fill-current" />
                    <span className="text-sm font-black text-jozi-forest">{vendor.rating}</span>
                  </div>
                </div>
              </div>

              {/* Profile Image & Content */}
              <div className="px-10 pb-10 -mt-16 relative grow flex flex-col">
                <div className="w-32 h-32 rounded-4xl border-8 border-white overflow-hidden shadow-xl mb-6 bg-white group-hover:scale-110 transition-transform duration-500">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4 grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-jozi-gold">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{vendor.location}</span>
                    </div>
                    {vendor.productCount !== undefined && vendor.productCount > 0 && (
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {vendor.productCount} {vendor.productCount === 1 ? 'Product' : 'Products'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{vendor.name}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm line-clamp-3">
                    {vendor.description}
                  </p>
                </div>

                <Link 
                  href={`/vendors/${vendor.id}`}
                  className="mt-10 w-full bg-jozi-forest text-white py-5 rounded-2xl font-black text-center flex items-center justify-center group/btn hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/10"
                >
                  Visit Storefront
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Become a Vendor CTA */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-jozi-gold rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
          <div className="lg:w-1/2 space-y-8 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-jozi-forest leading-none">
              READY TO <br />
              <span className="text-white">LEVEL UP?</span>
            </h2>
            <p className="text-jozi-forest/80 text-xl font-bold italic">
              Join the most prestigious digital marketplace for Joburg's finest artisans.
            </p>
            <Link href="/vendor/register" className="inline-block bg-jozi-forest text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-jozi-dark transition-all shadow-2xl">
              Apply to Sell
            </Link>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
            <div className="space-y-4 pt-12">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 text-jozi-forest">
                <p className="text-2xl font-black">2.4k+</p>
                <p className="text-xs font-bold uppercase tracking-widest">Monthly Shoppers</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 text-jozi-forest">
                <p className="text-2xl font-black">0%</p>
                <p className="text-xs font-bold uppercase tracking-widest">Listing Fees</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 text-jozi-forest">
                <p className="text-2xl font-black">24/7</p>
                <p className="text-xs font-bold uppercase tracking-widest">Expert Support</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 text-jozi-forest">
                <p className="text-2xl font-black">Joburg</p>
                <p className="text-xs font-bold uppercase tracking-widest">Wide Presence</p>
              </div>
            </div>
          </div>
          {/* Background Texture */}
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
      </section>
    </div>
  );
};

export default VendorsPage;
