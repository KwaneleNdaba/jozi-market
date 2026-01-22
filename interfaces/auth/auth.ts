export enum Role {
  ADMIN = "admin",
  INFLUENCER = "influencer",
  CUSTOMER = "customer",
  VENDOR = "vendor",
}

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date
}

export interface IUser {
  id?: string;
  email: string;
  password: string;
  role: Role | string;
  fullName: string;
  isAccountBlocked: boolean;
  canReview: boolean;
  phone: string;
  isPhoneConfirmed: boolean;
  profileUrl?: string;
  address?: string;
  provider_type?: string;
  provider_user_id?: string;
  otp?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdatePassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface DataStoreInToken {
  id: string;
  email: string;
  role: Role | string;
  isAccountBlocked: boolean;
  canReview: boolean;
  fullName: string;
  phone: string;
  isPhoneConfirmed: boolean;
  profileUrl?: string;
  address?: string;
  otp?: string;
  loyaltyPoints?: number;
  currentTierId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  totalOrders?: number;
  totalAmount?: number;
  totalReviews?:number;
}

export type IUserLogin = {
  email: string;
  password: string
}

// Frontend-specific types (not in backend)
export interface IDecodedJWT {
  id: string;
  email: string;
  role: Role | string;
  isAccountBlocked: boolean;
  canReview: any;
  fullName: string;
  phone: string;
  isPhoneConfirmed: boolean;
  profileUrl?: string;
  address?: string;
  tierName?: string; 
  totalOrders?: number; 
  loyaltyPoints?: number; 
  exp: number;
  iat: number;
}

// Import IVendorApplication type
import { IVendorApplication } from '../vendor/vendor';

// Vendor with application (extends IUser with vendor-specific data)
export interface IVendorWithApplication extends IUser {
  vendorApplication?: IVendorApplication;
  productCount?: number;
}

