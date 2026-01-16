
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, MapPin, Package, Clock, Info } from 'lucide-react';

const ShippingPage: React.FC = () => {
  const steps = [
    { title: 'Artisan Completion', icon: Package, desc: 'Vendors finish your handcrafted piece at their local workshop.' },
    { title: 'Hub Inspection', icon: ShieldCheck, desc: 'Pieces arrive at the Jozi Hub for quality and authenticity verification.' },
    { title: 'Courier Dispatch', icon: Truck, desc: 'Our delivery partners pick up your verified treasure.' },
    { title: 'Safe Arrival', icon: MapPin, desc: 'Delivered directly to your door anywhere in South Africa.' }
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      <section className="bg-jozi-forest py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-jozi-gold text-jozi-forest px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              Market Logistics
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">SHIPPING <br /><span className="text-jozi-gold">DELIVERED.</span></h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl mx-auto font-medium">Reliable delivery from Joburg's heart to your home.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-jozi-forest/5 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="font-black text-lg">{step.title}</h3>
              <p className="text-gray-400 text-sm font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-24">
        <div className="bg-white rounded-[4rem] p-12 lg:p-24 shadow-soft border border-jozi-forest/5">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Delivery Tiers</h2>
              <div className="space-y-6">
                {[
                  { label: 'Gauteng Express', time: '1-2 Days', price: 'R75', desc: 'Fast local delivery across Johannesburg and Pretoria.' },
                  { label: 'National Standard', time: '3-5 Days', price: 'R120', desc: 'Reliable delivery to any major city in South Africa.' },
                  { label: 'Regional / Outlying', time: '5-7 Days', price: 'R180', desc: 'Extended delivery for remote areas and towns.' }
                ].map((tier, i) => (
                  <div key={i} className="p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5 flex justify-between items-center group hover:bg-white transition-all">
                    <div>
                      <h4 className="font-black text-xl text-jozi-forest">{tier.label}</h4>
                      <p className="text-sm text-gray-400 font-medium">{tier.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-jozi-gold">{tier.price}</p>
                      <p className="text-[10px] font-black uppercase text-gray-400">{tier.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Important Notes</h2>
              <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-jozi-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-black text-lg">Lead Times</h4>
                    <p className="text-sm opacity-70">Since many items are made to order, please check the artisan lead time on the product page. Shipping starts after the craft is completed.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Info className="w-6 h-6 text-jozi-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-black text-lg">Tracking</h4>
                    <p className="text-sm opacity-70">You will receive a WhatsApp and Email notification once your piece has been verified and dispatched from our Hub.</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-jozi-gold opacity-10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPage;
