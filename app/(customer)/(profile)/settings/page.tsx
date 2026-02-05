'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Loader2, User, Mail, Phone } from 'lucide-react';
import { useProfileUser } from '@/app/contexts/ProfileUserContext';
import { useToast } from '@/app/contexts/ToastContext';
import { updateUserProfileAction, updateUserAddressAction } from '@/app/actions/auth/auth';

export default function SettingsPage() {
  const { user, refetch } = useProfileUser();
  const { showSuccess, showError } = useToast();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address state
  const [address, setAddress] = useState('');
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || ''
      });
      setAddress(user.address || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.fullName.trim()) {
      showError('Full name is required');
      return;
    }

    if (!profileForm.phone.trim()) {
      showError('Phone number is required');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await updateUserProfileAction(
        profileForm.fullName,
        profileForm.phone
      );

      if (response.error) {
        showError(response.message || 'Failed to update profile');
      } else {
        showSuccess('Profile updated successfully');
        await refetch(); // Refresh user data
      }
    } catch (error) {
      showError('An error occurred while updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      showError('Address is required');
      return;
    }

    setIsUpdatingAddress(true);
    try {
      const response = await updateUserAddressAction(address);

      if (response.error) {
        showError(response.message || 'Failed to update address');
      } else {
        showSuccess('Address updated successfully');
        await refetch(); // Refresh user data
      }
    } catch (error) {
      showError('An error occurred while updating address');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 text-left">
      {/* Profile Information Section */}
      <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8">
        <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
          <User className="w-5 h-5 mr-3 text-jozi-gold" />
          Profile Information
        </h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Full Name
            </label>
            <input 
              type="text" 
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              required
              className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              required
              placeholder="+27 XX XXX XXXX"
              className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Email Address (Read Only)
            </label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-400 outline-none cursor-not-allowed" 
            />
            <p className="text-[9px] text-gray-400 font-medium ml-1">
              To change your email, contact support or use the security settings.
            </p>
          </div>
          <button 
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full bg-jozi-forest text-white py-4 rounded-2xl font-black shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpdatingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Profile
          </button>
        </form>
      </div>

      {/* Delivery Address Section */}
      <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8">
        <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
          <MapPin className="w-5 h-5 mr-3 text-jozi-gold" />
          Delivery Address
        </h3>
        <form onSubmit={handleAddressUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Primary Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              placeholder="Enter your full delivery address&#10;e.g. 12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001"
              className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none"
            />
            <p className="text-[9px] text-gray-400 font-medium ml-1">
              This address will be used for all deliveries by default.
            </p>
          </div>
          <button 
            type="submit"
            disabled={isUpdatingAddress}
            className="w-full bg-jozi-forest text-white py-4 rounded-2xl font-black shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpdatingAddress && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Address
          </button>
        </form>

        {/* Current Address Display */}
        {user?.address && (
          <div className="p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5">
            <p className="font-black text-jozi-forest text-xs uppercase tracking-widest mb-2">
              Current Address
            </p>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {user.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
