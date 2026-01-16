'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  Key,
  Info,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  XCircle
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useToast } from '../../contexts/ToastContext';
import { sendOtpAction, verifyOtpAction, updatePasswordAction } from '../../actions/auth/auth';

type ResetStep = 'email' | 'otp' | 'reset' | 'success';

const VendorForgotPasswordPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirmPassword?: string }>({});
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateOtp = (otp: string[]): boolean => {
    return otp.every(digit => digit !== '' && /^\d$/.test(digit));
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: '', color: '' };
    if (password.length < 6) return { strength: 'Weak', color: 'text-red-500' };
    if (password.length < 8) return { strength: 'Fair', color: 'text-yellow-500' };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 'Strong', color: 'text-green-500' };
    }
    return { strength: 'Good', color: 'text-blue-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};

    // Client-side validation
    if (!email) {
      newErrors.email = 'Email is required';
      setErrors(newErrors);
      return;
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      setErrors(newErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email.trim().toLowerCase());
      const result = await sendOtpAction(null, formData);

      if (result.success) {
        // Proceed to OTP step on success
        setStep('otp');
        setOtpTimer(60);
        setCanResendOtp(false);
        showSuccess(result.message || 'OTP sent successfully! Please check your email.');
      } else {
        // Show error message (including "User Not Found")
        const errorMessage = result.message || 'Failed to send OTP. Please try again.';
        showError(errorMessage);
        setErrors({ email: errorMessage });
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setErrors({ email: err instanceof Error ? err.message : 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: undefined }));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { otp?: string } = {};

    // Client-side validation
    if (!validateOtp(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
      setErrors(newErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email.trim().toLowerCase());
      formData.append('otp', otp.join(''));
      const result = await verifyOtpAction(null, formData);

      if (result.success) {
        setStep('reset');
        showSuccess(result.message || 'OTP verified successfully!');
      } else {
        // Show error and highlight OTP field
        const errorMessage = result.message || 'Invalid OTP. Please try again.';
        showError(errorMessage);
        setErrors({ otp: errorMessage });
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP. Please try again.';
      showError(errorMessage);
      setErrors({ otp: errorMessage });
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp || isLoading) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email.trim().toLowerCase());
      const result = await sendOtpAction(null, formData);

      if (result.success) {
        setOtpTimer(60);
        setCanResendOtp(false);
        setOtp(['', '', '', '', '', '']);
        setErrors({});
        otpRefs.current[0]?.focus();
        showSuccess(result.message || 'OTP resent successfully! Please check your email.');
      } else {
        // Show error message (including "User Not Found")
        showError(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Client-side validation
    if (!password) {
      newErrors.password = 'New password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // If validation errors exist, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email.trim().toLowerCase());
      formData.append('otp', otp.join(''));
      formData.append('newPassword', password);
      const result = await updatePasswordAction(null, formData);

      if (result.success) {
        setStep('success');
        showSuccess(result.message || 'Password updated successfully!');
      } else {
        // Show error with specific message
        const errorMessage = result.message || 'Failed to update password. Please try again.';
        showError(errorMessage);
        
        // If OTP expired or invalid, go back to OTP step
        if (errorMessage.toLowerCase().includes('otp') || errorMessage.toLowerCase().includes('expired')) {
          setStep('otp');
          setOtp(['', '', '', '', '', '']);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('email');
    } else if (step === 'reset') {
      setStep('otp');
    }
    setErrors({});
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px] border border-jozi-forest/5"
      >
        <div className="lg:w-1/2 bg-jozi-forest relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-jozi-forest via-jozi-forest/80 to-transparent" />
          
          <div className="relative z-10 h-full p-16 flex flex-col justify-between text-white text-left">
            <Link href="/" className="inline-block -ml-10">
              <Logo className="h-40 w-auto" variant="white" />
            </Link>

            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-tight tracking-tighter uppercase">
                ARTISAN <br />
                <span className="text-jozi-gold italic">RECOVERY.</span>
              </h2>
              <p className="text-jozi-cream/60 text-lg font-medium max-w-md">
                Recover your workshop access to continue managing your manifests and capital.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold border border-white/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Secured Artisan Node</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="mb-12 text-left">
            {step === 'email' && (
              <Link href="/vendor/signin" className="inline-flex items-center space-x-2 text-jozi-forest font-black uppercase text-[10px] tracking-widest hover:text-jozi-gold transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Artisan Access</span>
              </Link>
            )}
          </div>

          {/* Back Button */}
          {step !== 'email' && step !== 'success' && (
            <button
              onClick={goBack}
              className="mb-6 inline-flex items-center space-x-2 text-jozi-forest font-black uppercase text-[10px] tracking-widest hover:text-jozi-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 text-left">
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Workshop <br /><span className="text-jozi-gold">Recovery.</span></h2>
                  <p className="text-gray-400 font-medium">Enter your workshop email to receive a recovery code.</p>
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        placeholder="artisan@workshop.za" 
                        className={`w-full bg-gray-50 border-2 rounded-[2rem] py-6 pl-16 pr-8 font-black text-jozi-forest outline-none transition-all ${
                          errors.email ? 'border-red-300' : 'border-transparent focus:border-jozi-gold/30'
                        }`}
                      />
                      {email && !errors.email && validateEmail(email) && (
                        <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-jozi-forest text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center group shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Recovery OTP
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 text-left">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold mb-6">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Security <br /><span className="text-jozi-gold">Challenge.</span></h2>
                  <p className="text-gray-400 font-medium">Verification dispatched to <span className="text-jozi-forest font-bold">{email}</span>.</p>
                </div>
                <form onSubmit={handleOtpSubmit} className="space-y-10">
                  <div>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`w-12 h-16 md:w-16 md:h-20 bg-gray-50 rounded-2xl border-2 text-center font-black text-3xl text-jozi-forest focus:border-jozi-gold/30 outline-none transition-all shadow-inner ${
                            errors.otp ? 'border-red-300' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <p className="text-[10px] text-red-500 font-bold mt-3 text-center flex items-center justify-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        {errors.otp}
                      </p>
                    )}
                  </div>
                  <div className="space-y-6">
                    <button 
                      type="submit"
                      disabled={isLoading || otp.some(d => !d)}
                      className="w-full bg-jozi-forest text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-jozi-dark transition-all"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Unlock Recovery'
                      )}
                    </button>
                    {otpTimer > 0 ? (
                      <p className="text-center text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                        Resend code in {otpTimer}s
                      </p>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading || !canResendOtp}
                        className="w-full text-[10px] font-black uppercase text-gray-400 hover:text-jozi-gold tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div key="reset" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 text-left">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-jozi-forest rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
                    <Key className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Define <br /><span className="text-jozi-gold italic">New Cipher.</span></h2>
                  <p className="text-gray-400 font-medium">Update your workshop credentials.</p>
                </div>
                <form onSubmit={handleResetSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        value={password} 
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className={`w-full bg-gray-50 border-2 rounded-2xl py-5 pl-16 pr-14 font-black text-jozi-forest outline-none transition-all ${
                          errors.password ? 'border-red-300' : 'border-transparent focus:border-jozi-gold/30'
                        }`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-jozi-forest"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password && passwordStrength.strength && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-2 w-6 rounded ${
                                level <= (['Weak', 'Fair', 'Good', 'Strong'].indexOf(passwordStrength.strength) + 1)
                                  ? passwordStrength.strength === 'Weak' ? 'bg-red-500' :
                                    passwordStrength.strength === 'Fair' ? 'bg-yellow-500' :
                                    passwordStrength.strength === 'Good' ? 'bg-blue-500' : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-black ${passwordStrength.color}`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Verify Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                        }}
                        className={`w-full bg-gray-50 border-2 rounded-2xl py-5 pl-16 pr-14 font-black text-jozi-forest outline-none transition-all ${
                          errors.confirmPassword ? 'border-red-300' : 'border-transparent focus:border-jozi-gold/30'
                        }`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-jozi-forest"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {confirmPassword && password === confirmPassword && (
                        <CheckCircle2 className="absolute right-14 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-jozi-forest text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-jozi-dark transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Update Artisan Cipher'
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" variants={stepVariants} initial="hidden" animate="visible" className="text-center space-y-8 py-8">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl mb-4">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase leading-none">Credentials <br /><span className="text-emerald-500">Restored.</span></h2>
                <p className="text-gray-400 font-medium">Your artisan account is now secure. Please sign in to re-access your cockpit.</p>
                <Link href="/vendor/signin" className="inline-block w-full bg-jozi-forest text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-jozi-dark transition-all">Return to Cockpit</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorForgotPasswordPage;