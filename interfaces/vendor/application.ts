/**
 * Vendor Application Types
 * 
 * These types represent the complete vendor application payload
 * submitted through the VendorApplicationPage form.
 */

export type VendorType = 'Individual' | 'Registered Business';

export type ProductCount = '1-10' | '11-50' | '50+';

export type FulfillmentType = 'Self-fulfilled' | 'Third-party (Jozi Hub)';

export interface Address {
  street: string;
  city: string;
  postal: string;
  country: string;
}

export interface Agreements {
  terms: boolean;
  privacy: boolean;
  popia: boolean;
  policies: boolean;
}

/**
 * Complete Vendor Application Payload
 * 
 * This represents the full application data that will be sent to the backend.
 * File uploads are handled separately via FormData or file upload endpoints.
 */
export interface VendorApplicationPayload {
  // Step 1: Entity Identity
  vendorType: VendorType;
  legalName: string;
  shopName: string;
  contactPerson: string;
  email: string;
  phone: string;

  // Step 2: Shop Branding
  description: string;
  website?: string;
  tagline?: string;

  // Step 3: Business Details
  cipcNumber?: string; // Required if vendorType === 'Registered Business'
  vatNumber?: string;
  productCount: ProductCount;
  fulfillment: FulfillmentType;
  address: Address;
  deliveryRegions: string[];

  // Step 5: Legal Compliance
  agreements: Agreements;
}

/**
 * File Uploads (handled separately)
 * 
 * These files are typically uploaded via FormData or a separate file upload endpoint.
 * The application payload may reference these files by their IDs or URLs after upload.
 */
export interface VendorApplicationFiles {
  logo?: File | string; // File object or URL after upload
  banner?: File | string;
  idDoc?: File | string;
  cipcDoc?: File | string; // Required if vendorType === 'Registered Business'
  bankProof?: File | string;
  addressProof?: File | string;
}

/**
 * Complete Vendor Application (including files)
 * 
 * This combines the payload and files for a complete representation.
 * In practice, files are usually uploaded separately and referenced by URL/ID.
 */
export interface VendorApplication extends VendorApplicationPayload {
  files?: VendorApplicationFiles;
}

/**
 * Vendor Application Response
 * 
 * Response structure from the backend after submitting an application.
 */
export interface VendorApplicationResponse {
  success: boolean;
  message?: string;
  error?: boolean;
  data?: {
    applicationId: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    submittedAt: string;
    estimatedReviewTime?: string; // e.g., "48 business hours"
  };
}

/**
 * Form Validation Errors
 * 
 * Structure for validation errors returned from the backend.
 */
export interface VendorApplicationErrors {
  vendorType?: string;
  legalName?: string;
  shopName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  description?: string;
  cipcNumber?: string;
  vatNumber?: string;
  productCount?: string;
  fulfillment?: string;
  address?: {
    street?: string;
    city?: string;
    postal?: string;
    country?: string;
  };
  agreements?: {
    terms?: string;
    privacy?: string;
    popia?: string;
    policies?: string;
  };
  files?: {
    logo?: string;
    banner?: string;
    idDoc?: string;
    cipcDoc?: string;
    bankProof?: string;
    addressProof?: string;
  };
}

/**
 * Draft Application
 * 
 * Structure for saving application drafts (without files).
 */
export interface VendorApplicationDraft extends VendorApplicationPayload {
  draftId?: string;
  savedAt?: string;
  lastModified?: string;
}
