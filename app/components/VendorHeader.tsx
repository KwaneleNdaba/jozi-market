import React, { useState, useEffect } from 'react';
import { Bell, Plus, Store, Loader2 } from 'lucide-react';
import { activateStoreAction, deactivateStoreAction, getCurrentUserStoreStatusAction } from '@/app/actions/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';

interface VendorHeaderProps {
  title: string;
  vendorName: string;
  onUploadClick?: () => void;
  storeActive?: boolean;
  onStoreToggle?: (isActive: boolean) => void;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ 
  title, 
  vendorName, 
  onUploadClick,
  storeActive: initialStoreActive,
  onStoreToggle
}) => {
  const { showSuccess, showError } = useToast();
  const [storeActive, setStoreActive] = useState(initialStoreActive ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch store status on mount
  useEffect(() => {
    const fetchStoreStatus = async () => {
      // Only fetch if initialStoreActive is not provided
      if (initialStoreActive === undefined) {
        try {
          const result = await getCurrentUserStoreStatusAction();
          if (result.success && result.isStoreActive !== undefined) {
            setStoreActive(result.isStoreActive);
          }
        } catch (err) {
          console.error('Error fetching store status:', err);
          // Keep default state on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchStoreStatus();
  }, [initialStoreActive]);

  // Sync state when prop changes
  useEffect(() => {
    if (initialStoreActive !== undefined) {
      setStoreActive(initialStoreActive);
    }
  }, [initialStoreActive]);

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    const newStatus = !storeActive;
    
    try {
      let result;
      if (newStatus) {
        result = await activateStoreAction();
      } else {
        result = await deactivateStoreAction();
      }

      if (result.success) {
        // Use the store status from the backend response if available, otherwise use the newStatus
        const backendStatus = (result as any).data?.isStoreActive;
        const finalStatus = backendStatus !== undefined ? backendStatus : newStatus;
        
        setStoreActive(finalStatus);
        onStoreToggle?.(finalStatus);
        showSuccess(result.message || `Store ${finalStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        // Don't update state on error - keep the current state
        showError(result.message || `Failed to ${newStatus ? 'activate' : 'deactivate'} store`);
      }
    } catch (err: any) {
      console.error('Error toggling store:', err);
      showError(err.message || 'An error occurred while toggling store');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="text-left space-y-1">
        <h1 className="text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
          {title}
        </h1>
        <p className="text-gray-400 font-medium italic">Managing {vendorName} Growth</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Store Toggle */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 border border-gray-100 shadow-sm">
          <Store className={`w-5 h-5 ${storeActive ? 'text-jozi-gold' : 'text-gray-300'}`} />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Store Status
            </span>
            <span className={`text-xs font-black ${storeActive ? 'text-emerald-600' : 'text-gray-400'}`}>
              {storeActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={handleToggle}
            disabled={isToggling || isLoading}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jozi-gold/20 ${
              storeActive ? 'bg-emerald-500' : 'bg-gray-300'
            } ${isToggling || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={storeActive ? 'Deactivate store' : 'Activate store'}
          >
            {isToggling || isLoading ? (
              <Loader2 className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 text-white animate-spin" />
            ) : (
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  storeActive ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default VendorHeader;