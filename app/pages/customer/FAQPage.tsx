
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageSquare, Zap, Store, Users } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      group: 'Shoppers',
      icon: Users,
      items: [
        { q: "Is Jozi Market safe to use?", a: "Absolutely. We use PayFast for all payments, meaning your bank details never touch our servers. Every artisan is also vetted by our Hub team." },
        { q: "How long does delivery take?", a: "Gauteng delivery is usually 1-2 days after the artisan finishes the piece. National shipping takes 3-5 working days." },
        { q: "Can I cancel my order?", a: "You can cancel any order within 2 hours of placing it. After that, the artisan may have already begun production." }
      ]
    },
    {
      group: 'Vendors',
      icon: Store,
      items: [
        { q: "How do I become an artisan vendor?", a: "Visit our 'Sell' page and complete the registration. We require a valid ID and a brief story about your craft." },
        { q: "What are the platform fees?", a: "We take a 7% commission on successful sales. There are no monthly listing fees for our Starter tier." }
      ]
    },
    {
      group: 'Loyalty & Points',
      icon: Zap,
      items: [
        { q: "How do I earn Market Points?", a: "Points are earned on every purchase (R1 = 1 Point) and by completing challenges in the 'Play & Earn' section." },
        { q: "How do I redeem my vouchers?", a: "Once you have enough points, head to the Rewards Boutique in the Games tab to exchange them for discount codes." }
      ]
    }
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      <section className="bg-jozi-forest py-24 relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">COMMON <br /><span className="text-jozi-gold">QUESTIONS.</span></h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl mx-auto font-medium">Everything you need to know about the marketplace.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-24">
        <div className="max-w-3xl mx-auto space-y-16">
          {faqData.map((group, gIdx) => (
            <div key={gIdx} className="space-y-8">
              <div className="flex items-center space-x-3 text-jozi-gold border-b border-jozi-forest/10 pb-4">
                <group.icon className="w-6 h-6" />
                <h3 className="text-2xl font-black uppercase tracking-widest">{group.group}</h3>
              </div>
              <div className="space-y-4">
                {group.items.map((item, iIdx) => {
                  const index = gIdx * 10 + iIdx;
                  return (
                    <div key={iIdx} className="bg-white rounded-3xl border border-jozi-forest/5 shadow-soft overflow-hidden">
                      <button 
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full p-8 flex items-center justify-between text-left group"
                      >
                        <span className="font-black text-lg text-jozi-forest group-hover:text-jozi-gold transition-colors">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180 text-jozi-gold' : 'text-gray-300'}`} />
                      </button>
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-8 pb-8 text-gray-500 font-medium leading-relaxed"
                          >
                            {item.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="bg-jozi-gold p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-jozi-forest shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-black leading-tight tracking-tight">Still have questions?</h3>
              <p className="font-bold opacity-80 italic">Our neighborhood support team is ready to help.</p>
            </div>
            <button className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-jozi-dark transition-all flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
