'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, User, Store, Mail, Phone, MapPin, Globe, ShieldCheck, 
  Package, Truck, CheckCircle2, ArrowRight, ChevronLeft, Upload, 
  Info, AlertCircle, FileText, Landmark, Layout, Sparkles, 
  X, Trash2, ExternalLink, Briefcase, Eye, Save, Gavel, 
  CreditCard, Search, Plus, BadgeCheck, Lock, RefreshCw
} from 'lucide-react';
import Logo from '../../components/Logo';
import { FILE_API } from '@/endpoints/rest-api/file/file';
import { submitVendorApplicationAction } from '@/app/actions/vendor/submit-application';
import { logger } from '@/lib/log';
import { useToast } from '../../contexts/ToastContext';

// --- Reusable Form Components ---

const FormInput = ({ label, required, error, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input 
      className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none transition-all ${
        error ? 'border-red-300' : 'border-transparent focus:border-jozi-gold/20'
      }`}
      {...props} 
    />
    {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
  </div>
);

const FormSelect = ({ label, options, required, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <select 
        className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none appearance-none cursor-pointer"
        {...props}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronLeft className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 -rotate-90 pointer-events-none" />
    </div>
  </div>
);

const FileUploadCard = ({ label, description, file, onUpload, onRemove, accept }: any) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center justify-center text-center min-h-[160px] ${
      file ? 'border-emerald-500/30 bg-emerald-50/10' : 'border-gray-200 bg-gray-50 hover:border-jozi-gold/20'
    }`}>
      {!file ? (
        <>
          <Upload className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-[11px] font-black text-jozi-forest uppercase tracking-widest">Drop artifact or click</p>
          <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-tighter">{description}</p>
          <input 
            type="file" 
            accept={accept}
            onChange={(e) => onUpload(e.target.files?.[0])}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </>
      ) : (
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              {file.type.includes('image') ? (
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <FileText className="w-6 h-6 text-jozi-forest" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-jozi-forest truncate">{file.name}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={onRemove} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  </div>
);

// --- Main Page Component ---

const STEPS = [
  { id: 1, title: 'Entity Identity', icon: User },
  { id: 2, title: 'Shop Branding', icon: Store },
  { id: 3, title: 'Operations', icon: Briefcase },
  { id: 4, title: 'Verification', icon: ShieldCheck },
  { id: 5, title: 'Final Review', icon: BadgeCheck }
];

const VendorApplicationPage: React.FC = () => {
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    vendorType: 'Individual',
    legalName: '',
    shopName: '',
    contactPerson: '',
    email: '',
    phone: '',
    description: '',
    website: '',
    tagline: '',
    cipcNumber: '',
    vatNumber: '',
    productCount: '1-10',
    fulfillment: 'Self', // Must match one of the FormSelect options: 'Self' or 'Jozi'
    address: { street: '', city: '', postal: '', country: 'South Africa' },
    agreements: { terms: false, privacy: false, popia: false, policies: false }
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    logo: null,
    banner: null,
    idDoc: null,
    cipcDoc: null,
    bankProof: null,
    addressProof: null
  });

  const updateFormData = (updates: any) => setFormData(prev => ({ ...prev, ...updates }));

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    setSaveDraftLoading(true);
    setTimeout(() => {
      setSaveDraftLoading(false);
      showSuccess('Application draft saved successfully. You can return later to complete it.');
    }, 1500);
  };

  const handleSubmit = async () => {
    // Validate required fields before proceeding
    if (!formData.vendorType || !formData.legalName || !formData.shopName || 
        !formData.contactPerson || !formData.email || !formData.phone) {
      showError('Please fill in all required fields in Step 1');
      setCurrentStep(1);
      return;
    }

    if (!formData.description || formData.description.length < 50) {
      showError('Description must be at least 50 characters');
      setCurrentStep(2);
      return;
    }

    if (!formData.address.street || !formData.address.city || !formData.address.postal) {
      showError('Please provide a complete address');
      setCurrentStep(3);
      return;
    }

    // Validate required files
    if (!files.idDoc || !files.bankProof) {
      showError('Please upload required documents (ID Document and Bank Proof)');
      setCurrentStep(4);
      return;
    }

    if (formData.vendorType === 'Registered Business' && !files.cipcDoc) {
      showError('CIPC registration document is required for registered businesses');
      setCurrentStep(4);
      return;
    }

    // Validate agreements
    if (!formData.agreements.terms || !formData.agreements.privacy || 
        !formData.agreements.popia || !formData.agreements.policies) {
      showError('Please accept all required agreements');
      setCurrentStep(5);
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload files first (following SinglePageProductFlow pattern)
      const uploadedFiles: { [key: string]: string } = {};

      // Upload logo if provided
      if (files.logo) {
        const logoFormData = new FormData();
        logoFormData.append('files', files.logo);
        const logoResponse = await FILE_API.UPLOAD_FILE(logoFormData);
        if (logoResponse?.data && logoResponse.data.length > 0) {
          uploadedFiles.logoUrl = logoResponse.data[0].url;
        }
      }

      // Upload banner if provided
      if (files.banner) {
        const bannerFormData = new FormData();
        bannerFormData.append('files', files.banner);
        const bannerResponse = await FILE_API.UPLOAD_FILE(bannerFormData);
        if (bannerResponse?.data && bannerResponse.data.length > 0) {
          uploadedFiles.bannerUrl = bannerResponse.data[0].url;
        }
      }

      // Upload ID document (required)
      if (files.idDoc) {
        const idDocFormData = new FormData();
        idDocFormData.append('files', files.idDoc);
        const idDocResponse = await FILE_API.UPLOAD_FILE(idDocFormData);
        if (idDocResponse?.data && idDocResponse.data.length > 0) {
          uploadedFiles.idDocUrl = idDocResponse.data[0].url;
        } else {
          throw new Error('Failed to upload ID document');
        }
      }

      // Upload bank proof (required)
      if (files.bankProof) {
        const bankProofFormData = new FormData();
        bankProofFormData.append('files', files.bankProof);
        const bankProofResponse = await FILE_API.UPLOAD_FILE(bankProofFormData);
        if (bankProofResponse?.data && bankProofResponse.data.length > 0) {
          uploadedFiles.bankProofUrl = bankProofResponse.data[0].url;
        } else {
          throw new Error('Failed to upload bank proof');
        }
      }

      // Upload CIPC doc if Registered Business
      if (formData.vendorType === 'Registered Business' && files.cipcDoc) {
        const cipcDocFormData = new FormData();
        cipcDocFormData.append('files', files.cipcDoc);
        const cipcDocResponse = await FILE_API.UPLOAD_FILE(cipcDocFormData);
        if (cipcDocResponse?.data && cipcDocResponse.data.length > 0) {
          uploadedFiles.cipcDocUrl = cipcDocResponse.data[0].url;
        } else {
          throw new Error('Failed to upload CIPC document');
        }
      }

      // Upload address proof if provided
      if (files.addressProof) {
        const addressProofFormData = new FormData();
        addressProofFormData.append('files', files.addressProof);
        const addressProofResponse = await FILE_API.UPLOAD_FILE(addressProofFormData);
        if (addressProofResponse?.data && addressProofResponse.data.length > 0) {
          uploadedFiles.addressProofUrl = addressProofResponse.data[0].url;
        }
      }

      setIsUploading(false);

      logger.info('[VendorApplicationPage] Uploaded files:', uploadedFiles);
      logger.info('[VendorApplicationPage] Form data before creating FormData:', formData);

      // Prepare FormData for server action
      const applicationFormData = new FormData();
      applicationFormData.append('vendorType', formData.vendorType);
      applicationFormData.append('legalName', formData.legalName);
      applicationFormData.append('shopName', formData.shopName);
      applicationFormData.append('contactPerson', formData.contactPerson);
      applicationFormData.append('email', formData.email);
      applicationFormData.append('phone', formData.phone);
      applicationFormData.append('description', formData.description);
      if (formData.website) applicationFormData.append('website', formData.website);
      if (formData.tagline) applicationFormData.append('tagline', formData.tagline);
      if (formData.cipcNumber) applicationFormData.append('cipcNumber', formData.cipcNumber);
      if (formData.vatNumber) applicationFormData.append('vatNumber', formData.vatNumber);
      applicationFormData.append('productCount', formData.productCount);
      applicationFormData.append('fulfillment', formData.fulfillment);
      applicationFormData.append('address', JSON.stringify(formData.address));
      applicationFormData.append('files', JSON.stringify(uploadedFiles));
      applicationFormData.append('agreements', JSON.stringify(formData.agreements));

      // Log FormData contents
      logger.info('[VendorApplicationPage] FormData contents:');
      for (const [key, value] of applicationFormData.entries()) {
        logger.info(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
      }

      // Submit application using server action
      logger.info('[VendorApplicationPage] Submitting application with FormData');
      const result = await submitVendorApplicationAction(null, applicationFormData);

      logger.info('[VendorApplicationPage] Submission result:', {
        success: result.success,
        error: result.error,
        message: result.message,
        hasData: !!result.data,
      });

      if (result.success && result.data) {
        logger.info(`[VendorApplicationPage] Application submitted successfully: ${result.data.id}`);
        setIsSubmitting(false);
        setIsSuccess(true);
        showSuccess('Application submitted successfully!');
        window.scrollTo(0, 0);
      } else {
        logger.error('[VendorApplicationPage] Submission failed:', result);
        setIsSubmitting(false);
        setIsUploading(false);
        showError(result.message || 'Failed to submit application. Please check the console for details.');
      }
    } catch (err) {
      logger.error('Error submitting vendor application:', err);
      setIsSubmitting(false);
      setIsUploading(false);
      showError(err instanceof Error ? err.message : 'An error occurred while submitting your application. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl text-center space-y-8 border border-jozi-forest/5"
        >
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-4xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
              Application <br /> <span className="text-jozi-gold">Dispatched.</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed italic">
              Your artisan application for <span className="text-jozi-forest font-bold">{formData.shopName || 'your workshop'}</span> has been successfully logged. Our stewards will review your artifacts within 48 business hours.
            </p>
          </div>
          <div className="p-8 bg-jozi-gold/5 rounded-3xl border border-jozi-gold/20 text-left space-y-4">
             <div className="flex items-center space-x-3 text-jozi-gold">
               <Info className="w-6 h-6" />
               <span className="text-xs font-black uppercase tracking-widest">Next Sequence</span>
             </div>
             <p className="text-sm text-jozi-forest font-medium leading-relaxed">
               An automated security link has been sent to <span className="font-bold">{formData.email}</span>. Please verify your address to continue the sequence.
             </p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/" className="grow bg-jozi-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl">Market Home</Link>
            <Link href="/shop" className="grow bg-jozi-cream text-jozi-forest py-5 rounded-2xl font-black uppercase tracking-widest">Explore Treasures</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jozi-cream py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Stepper */}
        <aside className="lg:w-80 shrink-0 space-y-8">
           <div className="bg-white rounded-5xl p-8 shadow-soft border border-jozi-forest/5 text-left sticky top-24">
              <Link href="/vendor/pricing" className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-jozi-forest transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" /> All Plans
              </Link>
              
              <div className="space-y-6">
                {STEPS.map((step) => (
                  <div key={step.id} className={`flex items-center space-x-5 transition-all duration-500 ${currentStep === step.id ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                      currentStep >= step.id ? 'bg-jozi-forest border-jozi-forest text-white' : 'bg-transparent border-gray-200 text-gray-400'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-jozi-gold tracking-widest">Step 0{step.id}</p>
                      <h4 className="font-black text-xs text-jozi-forest uppercase tracking-tight">{step.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-gray-100 text-left">
                 <div className="bg-jozi-gold/5 p-6 rounded-3xl border border-jozi-gold/20">
                    <p className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.2em] mb-3">Onboarding Help</p>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"Registration ensures we maintain a verified artisan community. Most applications are approved within 2 cycles."</p>
                 </div>
              </div>
           </div>
        </aside>

        {/* Main Form Body */}
        <main className="grow">
          <div className="bg-white rounded-[4rem] p-8 md:p-12 lg:p-16 shadow-soft border border-jozi-forest/5 min-h-[700px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Identity */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="text-left space-y-2">
                    <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Entity <br /><span className="text-jozi-gold italic">Identity.</span></h2>
                    <p className="text-gray-400 font-medium">Select your legal structure and primary identification.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vendor Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'Individual', icon: User, desc: 'Sole Proprietor' },
                          { id: 'Registered Business', icon: Building2, desc: 'CIPC Registered' }
                        ].map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => updateFormData({ vendorType: type.id })}
                            className={`p-6 rounded-3xl border-2 text-center transition-all ${
                              formData.vendorType === type.id ? 'bg-jozi-forest border-jozi-forest text-white shadow-xl' : 'bg-white border-gray-100 text-gray-300'
                            }`}
                          >
                            <type.icon className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-[11px] font-black uppercase tracking-widest">{type.id}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <FormInput 
                      label="Full Legal Name" required 
                      placeholder="As per ID or Company Reg"
                      value={formData.legalName}
                      onChange={(e: any) => updateFormData({ legalName: e.target.value })}
                    />
                    <FormInput 
                      label="Trading Name / Shop Name" required 
                      placeholder="e.g. Maboneng Fabrics"
                      value={formData.shopName}
                      onChange={(e: any) => updateFormData({ shopName: e.target.value })}
                    />
                    <FormInput 
                      label="Primary Contact Person" required 
                      placeholder="Full Name"
                      value={formData.contactPerson}
                      onChange={(e: any) => updateFormData({ contactPerson: e.target.value })}
                    />
                    <FormInput 
                      label="Official Email Address" required type="email" 
                      placeholder="vendor@jozimail.za"
                      value={formData.email}
                      onChange={(e: any) => updateFormData({ email: e.target.value })}
                    />
                    <FormInput 
                      label="Primary Phone Number" required type="tel" 
                      placeholder="+27..."
                      value={formData.phone}
                      onChange={(e: any) => updateFormData({ phone: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Branding */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="text-left space-y-2">
                    <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Shop <br /><span className="text-jozi-gold italic">Aesthetics.</span></h2>
                    <p className="text-gray-400 font-medium">How the neighborhood identifies and explores your workshop.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <FileUploadCard 
                        label="Workshop Emblem (Logo)" 
                        description="Square PNG/JPG, max 2MB"
                        file={files.logo}
                        onUpload={(f: File) => setFiles({ ...files, logo: f })}
                        onRemove={() => setFiles({ ...files, logo: null })}
                        accept="image/*"
                      />
                      <FileUploadCard 
                        label="Gallery Backdrop (Banner)" 
                        description="1920x400 recommended, max 5MB"
                        file={files.banner}
                        onUpload={(f: File) => setFiles({ ...files, banner: f })}
                        onRemove={() => setFiles({ ...files, banner: null })}
                        accept="image/*"
                      />
                    </div>

                    <div className="space-y-8 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">The Artisan Narrative</label>
                        <textarea 
                          rows={5} 
                          placeholder="Tell us about your craft, the materials you use, and your workshop's heritage..." 
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-3xl px-8 py-6 font-bold text-sm text-jozi-forest outline-none transition-all resize-none"
                          value={formData.description}
                          onChange={(e) => updateFormData({ description: e.target.value })}
                        />
                      </div>

                      <FormInput 
                        label="Online Hub (Website/Social URL)" 
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e: any) => updateFormData({ website: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Business Details */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="text-left space-y-2">
                    <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Operational <br /><span className="text-jozi-gold italic">Context.</span></h2>
                    <p className="text-gray-400 font-medium">Define your commercial reach and fulfillment logic.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formData.vendorType === 'Registered Business' && (
                      <>
                        <FormInput label="CIPC Reg Number" required placeholder="20XX/XXXXXX/XX" value={formData.cipcNumber} onChange={(e: any) => updateFormData({ cipcNumber: e.target.value })} />
                        <FormInput label="VAT Number (Optional)" placeholder="XXXXXXXXXX" value={formData.vatNumber} onChange={(e: any) => updateFormData({ vatNumber: e.target.value })} />
                      </>
                    )}
                    <FormSelect 
                      label="Fleet Scale (Products)" 
                      options={[{label: '1-10 Products', value: '1-10'}, {label: '11-50 Products', value: '11-50'}, {label: '50+ Products', value: '50+'}]} 
                      value={formData.productCount}
                      onChange={(e: any) => updateFormData({ productCount: e.target.value })}
                    />
                    <FormSelect 
                      label="Fulfillment Logic" 
                      options={[{label: 'Self-fulfilled', value: 'Self'}, {label: 'Third-party (Jozi Hub)', value: 'Jozi'}]} 
                      value={formData.fulfillment}
                      onChange={(e: any) => updateFormData({ fulfillment: e.target.value })}
                    />
                    <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                       <FormInput label="Street Address" placeholder="123 Fox Street" value={formData.address.street} onChange={(e: any) => updateFormData({ address: {...formData.address, street: e.target.value} })} />
                       <FormInput label="City" placeholder="Johannesburg" value={formData.address.city} onChange={(e: any) => updateFormData({ address: {...formData.address, city: e.target.value} })} />
                       <FormInput label="Postal Code" placeholder="2001" value={formData.address.postal} onChange={(e: any) => updateFormData({ address: {...formData.address, postal: e.target.value} })} />
                    </div>
                  </div>

                  <div className="p-8 bg-jozi-forest/5 rounded-4xl border border-jozi-forest/10 flex items-start space-x-6 text-left">
                     <div className="p-3 bg-white rounded-2xl shadow-sm text-jozi-gold"><Truck className="w-6 h-6" /></div>
                     <div className="space-y-1">
                        <h4 className="font-black text-sm text-jozi-forest uppercase tracking-tight">Logistics Verification</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                          Selecting "Jozi Hub" fulfillment requires your workshop to be within 50km of our Maboneng facility for initial verification cycles.
                        </p>
                     </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Verification */}
              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="text-left space-y-2">
                    <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Security <br /><span className="text-jozi-gold italic">Vault.</span></h2>
                    <p className="text-gray-400 font-medium">Verify your artisanal credentials to enable capital payouts.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FileUploadCard 
                        label="Government ID / Passport" required
                        description="Clear photo or PDF, max 2MB"
                        file={files.idDoc}
                        onUpload={(f: File) => setFiles({ ...files, idDoc: f })}
                        onRemove={() => setFiles({ ...files, idDoc: null })}
                        accept="image/*,application/pdf"
                      />
                      <FileUploadCard 
                        label="Proof of Bank Account" required
                        description="Bank letter ≤ 3 months old, max 2MB"
                        file={files.bankProof}
                        onUpload={(f: File) => setFiles({ ...files, bankProof: f })}
                        onRemove={() => setFiles({ ...files, bankProof: null })}
                        accept="image/*,application/pdf"
                      />
                      {formData.vendorType === 'Registered Business' && (
                        <FileUploadCard 
                          label="CIPC Registration Document" required
                          description="Company certificate PDF, max 5MB"
                          file={files.cipcDoc}
                          onUpload={(f: File) => setFiles({ ...files, cipcDoc: f })}
                          onRemove={() => setFiles({ ...files, cipcDoc: null })}
                          accept="application/pdf"
                        />
                      )}
                      <FileUploadCard 
                        label="Proof of Address (Optional)"
                        description="Utility bill or lease PDF"
                        file={files.addressProof}
                        onUpload={(f: File) => setFiles({ ...files, addressProof: f })}
                        onRemove={() => setFiles({ ...files, addressProof: null })}
                        accept="image/*,application/pdf"
                      />
                  </div>

                  <div className="bg-jozi-dark p-8 rounded-5xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                     <div className="relative z-10 space-y-2 text-left">
                        <div className="flex items-center space-x-3 text-jozi-gold">
                           <ShieldCheck className="w-6 h-6" />
                           <h4 className="text-xl font-black uppercase tracking-tight">Hub Encryption Protocol</h4>
                        </div>
                        <p className="text-xs text-jozi-cream/50 font-medium max-w-lg leading-relaxed">
                          Your artifacts are end-to-end encrypted and handled by a dedicated Jozi Hub security officer. We strictly adhere to the POPIA Data Protection Framework.
                        </p>
                     </div>
                     {/* Lock icon component used below, requiring the added import */}
                     <Lock className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Final Review */}
              {currentStep === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 text-left">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Manifest <br /><span className="text-jozi-gold italic">Summary.</span></h2>
                    <p className="text-gray-400 font-medium">Verify your artisan artifacts before official submission.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Review Section */}
                    <div className="space-y-8">
                       <div className="bg-gray-50 rounded-5xl p-10 space-y-10 relative overflow-hidden border border-gray-100 group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000"><Logo className="w-32 h-32" /></div>
                          
                          <div className="flex items-center space-x-6 relative z-10">
                             <div className="w-20 h-20 bg-white rounded-3xl border-4 border-white shadow-xl overflow-hidden shrink-0">
                                {files.logo ? <img src={URL.createObjectURL(files.logo)} className="w-full h-full object-cover" /> : <Store className="w-10 h-10 text-jozi-gold m-5" />}
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-jozi-forest">{formData.shopName || 'Untitled Workshop'}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                   <span className="text-[10px] font-black uppercase text-jozi-gold">{formData.vendorType}</span>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100 relative z-10">
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Artisan Liaison</p>
                                <p className="text-sm font-bold text-jozi-forest">{formData.contactPerson || 'Not Set'}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Workshop Zone</p>
                                <p className="text-sm font-bold text-jozi-forest">{formData.address.city || 'Johannesburg'}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Official Channel</p>
                                <p className="text-sm font-bold text-jozi-forest truncate">{formData.email}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Vault Artifacts</p>
                                <div className="flex items-center space-x-2 text-emerald-500 font-black text-[10px] uppercase">
                                   <CheckCircle2 className="w-3.5 h-3.5" />
                                   <span>5 Files Logged</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Legal Compliance */}
                    <div className="space-y-8">
                       <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Legal Governance</h3>
                       <div className="space-y-4">
                          {[
                            { id: 'terms', label: 'Artisan Service Terms', desc: 'Acknowledgement of marketplace fees and quality standards.' },
                            { id: 'privacy', label: 'Privacy & Cookie Logic', desc: 'Acceptance of platform behavioral tracking rules.' },
                            { id: 'popia', label: 'POPIA Compliance Consent', desc: 'Authorization to process sensitive business artifacts.' },
                            { id: 'policies', label: 'Dispute Resolution Policy', desc: 'Agreement to our mediation framework for returns.' }
                          ].map((legal) => (
                            <label key={legal.id} className="flex items-start space-x-4 p-6 bg-white rounded-3xl border-2 border-transparent hover:bg-gray-50 cursor-pointer transition-all">
                               <div className="pt-1">
                                  <input 
                                    type="checkbox" 
                                    className="w-6 h-6 accent-jozi-forest rounded-lg"
                                    checked={formData.agreements[legal.id as keyof typeof formData.agreements]}
                                    onChange={(e) => updateFormData({ agreements: { ...formData.agreements, [legal.id]: e.target.checked } })}
                                  />
                               </div>
                               <div className="space-y-1">
                                  <p className="font-black text-xs text-jozi-forest uppercase tracking-tight leading-none">{legal.label}</p>
                                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">"{legal.desc}"</p>
                               </div>
                            </label>
                          ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Action Footer */}
            <div className="mt-auto pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
               <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleBack}
                    className={`flex items-center space-x-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                      currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-jozi-forest'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Sequence</span>
                  </button>
               </div>

               <div className="flex flex-wrap items-center justify-center gap-4">
                 <button 
                  onClick={handleSaveDraft}
                  disabled={saveDraftLoading}
                  className="px-8 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center shadow-sm"
                 >
                    {saveDraftLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Progress
                 </button>
                 <button 
                  onClick={handleNext}
                  disabled={isSubmitting || isUploading}
                  className={`bg-jozi-forest text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center shadow-2xl transition-all group ${
                    isSubmitting || isUploading ? 'opacity-70 pointer-events-none' : 'hover:bg-jozi-dark hover:-translate-y-1'
                  }`}
                 >
                    {isUploading ? (
                      <span className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-3 animate-spin" /> Uploading Files...
                      </span>
                    ) : isSubmitting ? (
                      <span className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-3 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      <>
                        {currentStep === 5 ? 'Initialize Application' : 'Continue Forward'}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                 </button>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorApplicationPage;
