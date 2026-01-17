
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Store, 
  MapPin, 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle2, 
  Image as ImageIcon,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Package,
  Truck,
  FileText,
  User,
  AlertCircle,
  PenTool
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Identity', icon: Store },
  { id: 2, title: 'Operations', icon: Package },
  { id: 3, title: 'Verification', icon: ShieldCheck },
  { id: 4, title: 'Confirm', icon: CheckCircle2 }
];

const categories = [
  'Clothing & Fashion', 'Electronics', 'Accessories', 'Beauty', 'Home & Living', 'Other'
];

const VendorRegistrationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    businessType: 'Individual',
    selectedCategories: [] as string[],
    description: '',
    fullName: '',
    email: '',
    mobile: '',
    cityArea: '',
    idType: 'SA ID',
    productCount: '1–10',
    priceRange: 'R200 – R500',
    sellOnline: 'No',
    deliveryMethod: [] as string[],
    deliveryAreas: '',
    agreedAccuracy: false,
    agreedTerms: false,
    agreedPopia: false,
    signature: ''
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat) 
        ? prev.selectedCategories.filter(c => c !== cat)
        : [...prev.selectedCategories, cat]
    }));
  };

  const toggleDelivery = (method: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: prev.deliveryMethod.includes(method)
        ? prev.deliveryMethod.filter(m => m !== method)
        : [...prev.deliveryMethod, method]
    }));
  };

  return (
    <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white rounded-5xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[850px] border border-jozi-forest/5"
      >
        {/* Left Sidebar */}
        <div className="lg:w-1/3 bg-jozi-forest relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-linear-to-br from-jozi-forest via-jozi-forest/80 to-transparent" />
          
          <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
            <Link href="/" className="inline-block">
              <img src="https://i.ibb.co/8Y7XfH8/jozi-logo.png" alt="Jozi Market Logo" className="h-24 w-auto brightness-0 invert" />
            </Link>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-jozi-gold font-black uppercase tracking-widest text-[10px]">Step {currentStep} of 4</p>
                <h2 className="text-4xl font-black leading-tight tracking-tighter">
                  THE ARTISAN <br />
                  <span className="text-jozi-gold">PORTAL.</span>
                </h2>
              </div>
              <p className="text-jozi-cream/70 text-sm font-medium leading-relaxed">
                We're building the future of Joburg's local economy. Complete this application to join the collective.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="w-5 h-5 text-jozi-gold" />
                <span className="text-xs font-black uppercase tracking-widest">Helpful Note</span>
              </div>
              <p className="text-[11px] font-medium opacity-70">
                Keep your ID or Passport handy. For businesses, have your CIPC documents ready for upload.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="grow p-8 md:p-12 lg:p-16 bg-white relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="application-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-12 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -translate-y-1/2 z-0" />
                  {steps.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                        currentStep === step.id ? 'bg-jozi-gold border-jozi-gold text-white scale-110 shadow-lg' :
                        currentStep > step.id ? 'bg-jozi-forest border-jozi-forest text-white' : 'bg-white border-gray-100 text-gray-300'
                      }`}>
                        {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step Contents */}
                <div className="grow space-y-8">
                  {currentStep === 1 && (
                    <motion.div key="step1" className="space-y-8">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black text-jozi-forest border-l-4 border-jozi-gold pl-4">Basic Business Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store / Business Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Maboneng Fabrics" 
                              className="w-full bg-jozi-cream rounded-xl p-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Business Type</label>
                            <div className="flex gap-2">
                              {['Individual', 'Registered Business'].map(type => (
                                <button 
                                  key={type}
                                  onClick={() => setFormData({...formData, businessType: type})}
                                  className={`grow py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.businessType === type ? 'bg-jozi-forest text-white border-jozi-forest' : 'bg-white text-gray-400 border-gray-100'}`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categories</label>
                            <div className="flex flex-wrap gap-2">
                              {categories.map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => toggleCategory(cat)}
                                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${formData.selectedCategories.includes(cat) ? 'bg-jozi-gold text-white border-jozi-gold' : 'bg-white text-gray-400 border-gray-100 hover:border-jozi-gold/30'}`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brief Description</label>
                            <textarea 
                              maxLength={300}
                              rows={3}
                              placeholder="Tell us what you sell and who your customers are..." 
                              className="w-full bg-jozi-cream rounded-xl p-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 resize-none"
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-4">
                        <h3 className="text-2xl font-black text-jozi-forest border-l-4 border-jozi-gold pl-4">Contact Person</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="text" placeholder="John Doe" className="w-full bg-jozi-cream rounded-xl p-4 pl-12 font-bold text-sm text-jozi-forest outline-none" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="email" placeholder="john@example.com" className="w-full bg-jozi-cream rounded-xl p-4 pl-12 font-bold text-sm text-jozi-forest outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="tel" placeholder="+27 ..." className="w-full bg-jozi-cream rounded-xl p-4 pl-12 font-bold text-sm text-jozi-forest outline-none" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City / Area</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="text" placeholder="e.g. Soweto, Sandton" className="w-full bg-jozi-cream rounded-xl p-4 pl-12 font-bold text-sm text-jozi-forest outline-none" onChange={(e) => setFormData({...formData, cityArea: e.target.value})} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" className="space-y-10">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black text-jozi-forest border-l-4 border-jozi-gold pl-4">Products & Operations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Products</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['1–10', '11–50', '50+'].map(val => (
                                <button key={val} onClick={() => setFormData({...formData, productCount: val})} className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.productCount === val ? 'bg-jozi-forest text-white border-jozi-forest' : 'bg-jozi-cream text-gray-400 border-transparent'}`}>
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price Range</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Under R200', 'R200 – R500', 'R500+'].map(val => (
                                <button key={val} onClick={() => setFormData({...formData, priceRange: val})} className={`py-3 rounded-xl text-[9px] font-black transition-all border-2 ${formData.priceRange === val ? 'bg-jozi-forest text-white border-jozi-forest' : 'bg-jozi-cream text-gray-400 border-transparent'}`}>
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Do You Currently Sell Online?</label>
                            <div className="grid grid-cols-2 gap-4">
                              {['No', 'Yes (IG/WA/Web/Other)'].map(val => (
                                <button key={val} onClick={() => setFormData({...formData, sellOnline: val})} className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.sellOnline === val ? 'bg-jozi-forest text-white border-jozi-forest' : 'bg-jozi-cream text-gray-400 border-transparent'}`}>
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-4">
                        <h3 className="text-2xl font-black text-jozi-forest border-l-4 border-jozi-gold pl-4">Delivery Setup</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { id: 'Self', label: 'Handle My Own', icon: User },
                              { id: 'Jozi', label: 'Jozi Market Delivery', icon: Truck },
                              { id: 'Both', label: 'Both Methods', icon: Package }
                            ].map(method => (
                              <button 
                                key={method.id} 
                                onClick={() => toggleDelivery(method.id)}
                                className={`p-6 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${formData.deliveryMethod.includes(method.id) ? 'bg-jozi-gold text-white border-jozi-gold shadow-lg' : 'bg-jozi-cream text-gray-400 border-transparent'}`}
                              >
                                <method.icon className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                              </button>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Areas (City / Zones)</label>
                            <input type="text" placeholder="e.g. Greater Joburg, Pretoria East" className="w-full bg-jozi-cream rounded-xl p-4 font-bold text-sm text-jozi-forest outline-none" onChange={(e) => setFormData({...formData, deliveryAreas: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" className="space-y-10">
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Verification Info</h3>
                          <p className="text-gray-400 text-sm font-medium italic">Your security is our priority. Documents are encrypted and handled privately.</p>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select ID Type</label>
                            <div className="flex gap-4">
                              {['South African ID', 'Passport'].map(type => (
                                <button key={type} onClick={() => setFormData({...formData, idType: type})} className={`grow py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.idType === type ? 'bg-jozi-forest text-white border-jozi-forest' : 'bg-white text-gray-400 border-gray-100'}`}>
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload ID Document (PDF/IMG)</label>
                              <div className="w-full aspect-square bg-jozi-cream rounded-3xl border-2 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center group hover:bg-jozi-gold/5 cursor-pointer">
                                <FileText className="w-8 h-8 text-jozi-gold/40 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Drop ID here</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Business Registration (Optional for Individuals)</label>
                              <div className="w-full aspect-square bg-jozi-cream rounded-3xl border-2 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center group hover:bg-jozi-gold/5 cursor-pointer">
                                <ImageIcon className="w-8 h-8 text-jozi-gold/40 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">CIPC Document</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" className="space-y-10">
                      <div className="space-y-6">
                        <h3 className="text-3xl font-black text-jozi-forest tracking-tighter">Agreement & Consent</h3>
                        
                        <div className="space-y-4">
                          {[
                            { id: 'agreedAccuracy', label: 'I confirm that the information provided is accurate', icon: CheckCircle2 },
                            { id: 'agreedTerms', label: 'I agree to Jozi Market’s Vendor Terms & Conditions', icon: FileText },
                            { id: 'agreedPopia', label: 'I agree to comply with POPIA data protection rules', icon: ShieldCheck }
                          ].map(item => (
                            <button 
                              key={item.id}
                              onClick={() => setFormData({...formData, [item.id]: !formData[item.id as keyof typeof formData]})}
                              className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all text-left ${formData[item.id as keyof typeof formData] ? 'bg-jozi-forest/5 border-jozi-forest/20' : 'bg-white border-gray-100 hover:border-jozi-gold/20'}`}
                            >
                              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-4 ${formData[item.id as keyof typeof formData] ? 'bg-jozi-forest border-jozi-forest text-white' : 'border-gray-200'}`}>
                                {formData[item.id as keyof typeof formData] && <CheckCircle2 className="w-4 h-4" />}
                              </div>
                              <span className="text-sm font-bold text-jozi-forest">{item.label}</span>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-4 pt-6">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Signature</label>
                          <div className="relative">
                            <PenTool className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-jozi-gold" />
                            <input 
                              type="text" 
                              placeholder="Type your full name to sign" 
                              className="w-full bg-jozi-cream rounded-3xl p-8 pl-16 font-black text-3xl italic tracking-tight text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                              onChange={(e) => setFormData({...formData, signature: e.target.value})}
                            />
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                            Timestamp: {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <button 
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`flex items-center space-x-2 font-black text-sm uppercase tracking-widest transition-all ${
                      currentStep === 1 ? 'opacity-0' : 'text-gray-400 hover:text-jozi-forest'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>

                  <button 
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="bg-jozi-forest text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center shadow-2xl shadow-jozi-forest/20 hover:scale-105 transition-all group"
                  >
                    {isSubmitting ? 'Submitting Application...' : currentStep === 4 ? 'Submit Application' : 'Next Step'}
                    {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="application-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4 max-w-lg">
                  <h2 className="text-5xl font-black text-jozi-forest tracking-tighter">Application Logged!</h2>
                  <p className="text-xl text-gray-500 font-medium leading-relaxed">
                    Thank you, <span className="text-jozi-forest font-bold">{formData.fullName}</span>. 
                    Your vendor profile for <span className="text-jozi-gold font-bold">{formData.storeName}</span> is being processed under POPIA guidelines. 
                    We'll contact you at <span className="text-jozi-forest font-bold">{formData.email}</span> within 24-48 hours.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl">Return Home</Link>
                  <Link href="/shop" className="bg-jozi-cream text-jozi-forest px-10 py-5 rounded-2xl font-black text-lg">Browse Products</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorRegistrationPage;
