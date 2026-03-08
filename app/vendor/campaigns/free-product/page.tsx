'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, List } from 'lucide-react';
import FreeProductCampaign from '@/app/components/vendor/FreeProductCampaign';
import MyCampaignsList from '@/app/components/vendor/MyCampaignsList';
import { createCampaignAction, getMyCampaignsAction, deleteCampaignAction } from '@/app/actions/freeProductCampaign';
import { getMyProductsAction } from '@/app/actions/product';

type TabType = 'submit' | 'campaigns';

export default function FreeProductCampaignPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('submit');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (data: { 
    productId: string; 
    variantId?: string | null;
    quantity: number; 
  }) => {
    try {
      console.log('Campaign submission:', data);
      
      // Get vendor ID from token (this will be done server-side in the action)
      // For now, we'll let the backend handle vendorId and pointsRequired
      const response = await createCampaignAction({
        vendorId: '', // Will be set by backend from authenticated user
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
        pointsRequired: 0, // Will be set by admin during approval
      });
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      // Trigger refresh of campaigns list
      setRefreshTrigger(prev => prev + 1);
      
      // Switch to campaigns tab to see the new submission
      setActiveTab('campaigns');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteCampaignAction(id);
    if (response.error) {
      throw new Error(response.message);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Free Product Campaigns</h1>
          <p className="text-sm text-gray-600 mt-1">
            Submit products for free campaigns and track your submissions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('submit')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'submit'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Submit New Campaign</span>
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'campaigns'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
                <span>My Campaigns</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'submit' && (
              <FreeProductCampaign 
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                fetchProducts={getMyProductsAction}
              />
            )}

            {activeTab === 'campaigns' && (
              <MyCampaignsList 
                fetchCampaigns={getMyCampaignsAction}
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
