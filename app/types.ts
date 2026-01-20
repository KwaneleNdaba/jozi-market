
export interface Vendor {
  id: string;
  name: string;
  rating: number;
  image: string;
  location: string;
  description: string;
  planTier: 'Free' | 'Starter' | 'Growth' | 'Pro';
  subscriptionFee: number;
  commissionRate: number;
}

export type OnboardingStatus = 'Pending' | 'Approved' | 'Declined' | 'More Info Requested' | 'Blocked';

export type RejectionReason = 
  | 'Incomplete Documentation'
  | 'Invalid Business Information'
  | 'Failed Background Check'
  | 'Non-Compliance with Terms'
  | 'Duplicate Application'
  | 'Insufficient Business Credentials'
  | 'Inappropriate Content'
  | 'Other';

export const REJECTION_REASONS: RejectionReason[] = [
  'Incomplete Documentation',
  'Invalid Business Information',
  'Failed Background Check',
  'Non-Compliance with Terms',
  'Duplicate Application',
  'Insufficient Business Credentials',
  'Inappropriate Content',
  'Other',
];

export interface VendorApplication {
  id: string;
  businessName: string;
  applicantName: string;
  email: string;
  phone: string;
  status: OnboardingStatus;
  dateApplied: string;
  category: string;
  description: string;
  documents: {
    name: string;
    type: 'ID' | 'CIPC' | 'Portfolio' | 'Bank';
    url: string;
  }[];
  businessAddress: string;
}

export type OrderStatus = 'Processing' | 'Picked' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface MarketOrder {
  id: string;
  vendorName: string;
  customerName: string;
  customerEmail: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  category: string;
  paymentMethod: 'Card' | 'EFT' | 'Points';
  shippingAddress: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'Sales' | 'Marketing' | 'Logistics' | 'AI & Analytics';
  minTier: 'Free' | 'Starter' | 'Growth' | 'Pro';
  isNew?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  vendor: {
    id: string;
    name: string;
    rating: number;
    logo?: string;
    description?: string;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  variants?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    type: string;
    options: string[];
  }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface GameChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

// New types for Registration Form
export interface RegistrationFile {
  file: File;
  previewUrl: string;
  name: string;
  size: string;
}

export interface RegistrationFormData {
  vendorType: 'Individual' | 'Business';
  businessName: string;
  registrationNumber: string;
  vatNumber: string;
  storeName: string;
  storeDescription: string;
  categories: string[];
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    primaryName: string;
    email: string;
    phone: string;
    altContact: string;
  };
  plan: 'Free' | 'Starter' | 'Growth' | 'Pro';
  marketingSupport: boolean;
  allowPromoContent: boolean;
  bankInfo: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
  };
  security: {
    password: '';
    confirmPassword: '';
  };
  agreements: {
    terms: boolean;
    privacy: boolean;
  };
}
