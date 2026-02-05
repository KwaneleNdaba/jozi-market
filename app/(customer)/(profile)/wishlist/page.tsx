'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { products } from '../../../data/mockData';

export default function WishlistPage() {
  const wishlistItems = products.slice(0, 3);

  return (
    <div className="bg-white rounded-5xl p-10 border border-jozi-forest/5 shadow-soft text-left">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Saved Treasures</h3>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{wishlistItems.length} Handpicked Pieces</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex gap-6 p-4 bg-jozi-cream/30 rounded-3xl border border-jozi-forest/5 group hover:bg-white transition-all">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm shrink-0">
              <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
            </div>
            <div className="grow flex flex-col justify-between py-2">
              <div>
                <h4 className="font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{item.name}</h4>
                <p className="text-xs font-bold text-jozi-gold uppercase tracking-widest mt-1">by {item.vendor.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-jozi-forest">R{item.price}</span>
                <button className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest tracking-widest">Transfer to Bag</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
