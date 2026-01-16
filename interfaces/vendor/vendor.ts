/**
 * Vendor Application Types
 * 
 * These types are aligned with the backend types from:
 * Backend: /Backend/src/types/vendor.types.ts
 * 
 * IMPORTANT: Keep these types in sync with the backend!
 */

export enum VendorApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum VendorType {
  INDIVIDUAL = 'Individual',
  BUSINESS = 'Business', // Backend uses "Business", frontend form displays "Registered Business"
}

// Note: Backend expects exact enum values: "Individual" or "Business"
// Frontend form displays "Registered Business" but maps to "Business" before sending

/**
 * Helper function to map frontend display value to backend value
 */
export function mapVendorTypeToBackend(frontendValue: string): string {
  if (frontendValue === 'Registered Business') {
    return VendorType.BUSINESS;
  }
  return frontendValue;
}

/**
 * Helper function to map backend value to frontend display value
 */
export function mapVendorTypeToFrontend(backendValue: string): string {
  if (backendValue === VendorType.BUSINESS) {
    return 'Registered Business';
  }
  return backendValue;
}

export interface VendorAddress {
  street: string;
  city: string;
  postal: string;
  country: string;
}

export interface VendorFiles {
  logoUrl?: string;
  bannerUrl?: string;
  idDocUrl?: string;
  bankProofUrl?: string;
  addressProofUrl?: string;
  cipcDocUrl?: string;
}

export interface VendorAgreements {
  terms: boolean;
  privacy: boolean;
  popia: boolean;
  policies: boolean;
}

/**
 * Complete Vendor Application (matches backend IVendorApplication)
 * 
 * Note: Date fields can be Date objects or ISO strings (for JSON serialization)
 */
export interface IVendorApplication {
  id?: string;
  userId?: string | null;
  status: VendorApplicationStatus | string;
  submittedAt?: Date | string; // Backend: Date, but JSON serializes as string
  createdAt?: Date | string; // Backend: Date, but JSON serializes as string
  updatedAt?: Date | string; // Backend: Date, but JSON serializes as string

  vendorType: VendorType | string;
  legalName: string;
  shopName: string;
  contactPerson: string;
  email: string;
  phone: string;

  description: string;
  website?: string;
  tagline?: string;

  cipcNumber?: string | null; // Required if vendorType === 'Business'
  vatNumber?: string; // Optional
  productCount: string; // e.g., '1-10', '11-50', '50+'
  fulfillment: string; // e.g., 'Self', 'Jozi' (backend accepts any string)
  address: VendorAddress;
  deliveryRegions: string[];

  files: VendorFiles;

  agreements: VendorAgreements;

  reviewedBy?: string | null;
  reviewedAt?: Date | string | null; // Backend: Date | null, but JSON serializes as string
  rejectionReason?: string | null;
}

/**
 * Create Vendor Application Payload (matches backend ICreateVendorApplication)
 */
export interface ICreateVendorApplication {
  userId?: string | null;
  vendorType: VendorType | string; // Must be "Individual" or "Business"
  legalName: string;
  shopName: string;
  contactPerson: string;
  email: string;
  phone: string;
  description: string;
  website?: string; // Optional
  tagline?: string; // Optional
  cipcNumber?: string | null; // Required if vendorType === 'Business'
  vatNumber?: string; // Optional
  productCount: string; // e.g., '1-10', '11-50', '50+'
  fulfillment: string; // e.g., 'Self', 'Jozi'
  address: VendorAddress;
  deliveryRegions: string[];
  files: VendorFiles;
  agreements: VendorAgreements;
}

/**
 * Update Vendor Application Status Payload (matches backend IUpdateVendorApplicationStatus)
 */
export interface IUpdateVendorApplicationStatus {
  id: string;
  status: VendorApplicationStatus | string;
  reviewedBy: string;
  rejectionReason?: string | null;
}
