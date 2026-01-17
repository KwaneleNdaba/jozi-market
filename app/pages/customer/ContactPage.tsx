
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      <section className="bg-jozi-forest py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-jozi-gold">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Connect with Jozi</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">SAY <br /><span className="text-jozi-gold">HELLO.</span></h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl mx-auto font-medium">We'd love to hear from our neighbors, artisans, and partners.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Info Panel */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-10">
              <h3 className="text-2xl font-black text-jozi-forest">The Hub</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headquarters</p>
                    <p className="font-bold text-jozi-forest leading-tight mt-1">144 Fox Street, Maboneng, <br />Joburg, 2001</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direct Support</p>
                    <p className="font-bold text-jozi-forest mt-1">hello@jozimarket.co.za</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call Center</p>
                    <p className="font-bold text-jozi-forest mt-1">+27 11 555 0123</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-jozi-dark p-10 rounded-5xl text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-black">Workshop Hours</h4>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium border-b border-white/5 pb-2">
                    <span className="opacity-60">Mon - Fri</span>
                    <span className="text-jozi-gold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium border-b border-white/5 pb-2">
                    <span className="opacity-60">Saturday</span>
                    <span className="text-jozi-gold">10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="opacity-60">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>
              <Clock className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5 text-jozi-gold group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:grow bg-white p-10 lg:p-20 rounded-[4rem] border border-jozi-forest/5 shadow-soft">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Send a Message</h2>
                <p className="text-gray-400 font-medium">Fill out the form below and our team will get back to you within 4 business hours.</p>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                    <input type="text" placeholder="Thabo Modise" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input type="email" placeholder="thabo@example.com" className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <select className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Become a Vendor</option>
                    <option>Bulk Corporate Gifting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <textarea rows={5} placeholder="How can we help your local journey?" className="w-full bg-jozi-cream rounded-3xl px-8 py-6 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none" />
                </div>

                <button type="submit" className="w-full bg-jozi-forest text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center shadow-2xl shadow-jozi-forest/30 hover:bg-jozi-dark transition-all group">
                  <Send className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Dispatch Message
                </button>
              </form>

              <div className="pt-12 border-t border-jozi-forest/5 flex flex-col md:flex-row items-center justify-center gap-12 grayscale opacity-40">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-xs">WhatsApp Active</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-xs">Email Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
