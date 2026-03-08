import { baseUrl } from '@/endpoints/url';

export const freeProductCampaignEndpoints = {
  // Get all campaigns
  getAll: `${baseUrl}/free-product-campaigns`,
  
  // Get visible campaigns (public)
  getVisible: `${baseUrl}/free-product-campaigns/visible`,
  
  // Get pending campaigns (admin)
  getPending: `${baseUrl}/free-product-campaigns/pending`,
  
  // Get by vendor
  getByVendor: (vendorId: string) => `${baseUrl}/free-product-campaigns/vendor/${vendorId}`,
  
  // Get by product
  getByProduct: (productId: string) => `${baseUrl}/free-product-campaigns/product/${productId}`,
  
  // Get by ID
  getById: (id: string) => `${baseUrl}/free-product-campaigns/${id}`,
  
  // Create campaign
  create: `${baseUrl}/free-product-campaigns`,
  
  // Update campaign
  update: (id: string) => `${baseUrl}/free-product-campaigns/${id}`,
  
  // Delete campaign
  delete: (id: string) => `${baseUrl}/free-product-campaigns/${id}`,
  
  // Approve campaign (admin)
  approve: (id: string) => `${baseUrl}/free-product-campaigns/${id}/approve`,
  
  // Reject campaign (admin)
  reject: (id: string) => `${baseUrl}/free-product-campaigns/${id}/reject`,
  
  // Set visibility
  setVisibility: (id: string) => `${baseUrl}/free-product-campaigns/${id}/visibility`,
  
  // Record view
  recordView: (id: string) => `${baseUrl}/free-product-campaigns/${id}/view`,
} as const;
