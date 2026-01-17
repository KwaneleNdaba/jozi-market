'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { IDecodedJWT, IUser, IUserLogin, Role, TokenData } from '@/interfaces/auth/auth';
import { serverPOST } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { logger } from '@/lib/log';
import { getMyActiveSubscriptionAction } from '@/app/actions/subscription';

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: boolean;
}

/**
 * Server action for user login
 */
export async function signInAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: true,
        message: 'Email and password are required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters',
      };
    }

    // Call API using server client (login doesn't need auth token)
    const loginData: IUserLogin = { email, password };
    const response = await serverPOST(`${baseUrl}/auth/login`, loginData);

    if (response.error || !response.data) {
      return {
        success: false,
        error: true,
        message: response.message || 'Login failed. Please check your credentials.',
      };
    }

    // Store tokens in cookies (server-side)
    // Convert expiresAt string to Date object if needed
    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt 
        ? (typeof response.data.expiresAt === 'string' 
          ? new Date(response.data.expiresAt) 
          : response.data.expiresAt)
        : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours if not provided
    };

    const cookieStore = await cookies();
    cookieStore.set('userToken', JSON.stringify(tokenData), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false,
    });

    // Decode token to get user role for routing
    let redirectPath = '/profile';
    try {
      const decodedUser: IDecodedJWT = jwtDecode(response.data.accessToken);
      const role = decodedUser.role?.toLowerCase();

      if (role === Role.ADMIN || role === 'superadmin') {
        redirectPath = '/admin/dashboard';
      } else if (role === Role.VENDOR) {
        redirectPath = '/vendor/dashboard';
      } else if (role === Role.INFLUENCER) {
        redirectPath = '/influencer/dashboard';
      }
    } catch (decodeError) {
      logger.error('Error decoding token:', decodeError);
    }

    // Redirect on success
    redirect(redirectPath);
  } catch (err: unknown) {
    logger.error('Sign in error:', err);

    // Handle redirect errors gracefully
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err; // Re-throw redirect errors
    }

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
    };
  }
}

/**
 * Server action for admin login - only allows admin users
 */
export async function adminSignInAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: true,
        message: 'Email and password are required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters',
      };
    }

    // Call API using server client
    const loginData: IUserLogin = { email, password };
    const response = await serverPOST(`${baseUrl}/auth/login`, loginData);

    if (response.error || !response.data) {
      return {
        success: false,
        error: true,
        message: response.message || 'Login failed. Please check your credentials.',
      };
    }

    // Decode token to check role
    try {
      const decodedUser: IDecodedJWT = jwtDecode(response.data.accessToken);
      const role = decodedUser.role?.toLowerCase();

      // Only allow admin users
      if (role !== Role.ADMIN && role !== 'superadmin') {
        return {
          success: false,
          error: true,
          message: 'Access denied. Admin credentials required.',
        };
      }
    } catch (decodeError) {
      logger.error('Error decoding token:', decodeError);
      return {
        success: false,
        error: true,
        message: 'Failed to verify user role. Please try again.',
      };
    }

    // Store tokens in cookies (server-side)
    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt 
        ? (typeof response.data.expiresAt === 'string' 
          ? new Date(response.data.expiresAt) 
          : response.data.expiresAt)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const cookieStore = await cookies();
    cookieStore.set('userToken', JSON.stringify(tokenData), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false,
    });

    // Redirect to admin dashboard
    redirect('/admin/dashboard');
  } catch (err: unknown) {
    logger.error('Admin sign in error:', err);

    // Handle redirect errors gracefully
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err; // Re-throw redirect errors
    }

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred during sign in',
    };
  }
}

/**
 * Server action for customer login - only allows customer users
 */
export async function customerSignInAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: true,
        message: 'Email and password are required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters',
      };
    }

    // Call API using server client
    const loginData: IUserLogin = { email, password };
    const response = await serverPOST(`${baseUrl}/auth/login`, loginData);

    if (response.error || !response.data) {
      return {
        success: false,
        error: true,
        message: response.message || 'Login failed. Please check your credentials.',
      };
    }

    // Decode token to check role
    try {
      const decodedUser: IDecodedJWT = jwtDecode(response.data.accessToken);
      const role = decodedUser.role?.toLowerCase();

      // Only allow customer users
      if (role !== Role.CUSTOMER) {
        return {
          success: false,
          error: true,
          message: 'Invalid credentials. This account is not a customer account.',
        };
      }
    } catch (decodeError) {
      logger.error('Error decoding token:', decodeError);
      return {
        success: false,
        error: true,
        message: 'Failed to verify user role. Please try again.',
      };
    }

    // Store tokens in cookies (server-side)
    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt 
        ? (typeof response.data.expiresAt === 'string' 
          ? new Date(response.data.expiresAt) 
          : response.data.expiresAt)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const cookieStore = await cookies();
    cookieStore.set('userToken', JSON.stringify(tokenData), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false,
    });

    // Redirect to customer profile
    redirect('/profile');
  } catch (err: unknown) {
    logger.error('Customer sign in error:', err);

    // Handle redirect errors gracefully
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err; // Re-throw redirect errors
    }

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred during sign in',
    };
  }
}

/**
 * Server action for vendor login - only allows vendor users
 */
export async function vendorSignInAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: true,
        message: 'Email and password are required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters',
      };
    }

    // Call API using server client
    const loginData: IUserLogin = { email, password };
    const response = await serverPOST(`${baseUrl}/auth/login`, loginData);

    if (response.error || !response.data) {
      return {
        success: false,
        error: true,
        message: response.message || 'Login failed. Please check your credentials.',
      };
    }

    // Decode token to check role
    try {
      const decodedUser: IDecodedJWT = jwtDecode(response.data.accessToken);
      const role = decodedUser.role?.toLowerCase();

      // Only allow vendor users
      if (role !== Role.VENDOR) {
        return {
          success: false,
          error: true,
          message: 'Invalid credentials. This account is not a vendor account.',
        };
      }
    } catch (decodeError) {
      logger.error('Error decoding token:', decodeError);
      return {
        success: false,
        error: true,
        message: 'Failed to verify user role. Please try again.',
      };
    }

    // Store tokens in cookies (server-side)
    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt 
        ? (typeof response.data.expiresAt === 'string' 
          ? new Date(response.data.expiresAt) 
          : response.data.expiresAt)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const cookieStore = await cookies();
    cookieStore.set('userToken', JSON.stringify(tokenData), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false,
    });

    // Check if user has an active subscription
    try {
      const subscriptionResponse = await getMyActiveSubscriptionAction();
      
      // If no active subscription found, redirect to subscription page
      if (subscriptionResponse.error || !subscriptionResponse.data) {
        logger.info('[Vendor Sign In] No active subscription found, redirecting to subscription page');
        redirect('/vendor/subscription');
      }

      // User has active subscription, redirect to dashboard
      logger.info('[Vendor Sign In] Active subscription found, redirecting to dashboard');
    redirect('/vendor/dashboard');
    } catch (subscriptionError: unknown) {
      // Re-throw redirect errors (they need to propagate)
      if (
        subscriptionError &&
        typeof subscriptionError === 'object' &&
        'digest' in subscriptionError &&
        typeof subscriptionError.digest === 'string' &&
        subscriptionError.digest.startsWith('NEXT_REDIRECT')
      ) {
        throw subscriptionError;
      }
      
      // If subscription check fails, still redirect to subscription page as a safe fallback
      logger.error('[Vendor Sign In] Error checking subscription, redirecting to subscription page:', subscriptionError);
      redirect('/vendor/subscription');
    }
  } catch (err: unknown) {
    logger.error('Vendor sign in error:', err);

    // Handle redirect errors gracefully
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err; // Re-throw redirect errors
    }

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred during sign in',
    };
  }
}

/**
 * Server action to send OTP for password reset
 */
export async function sendOtpAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;

    if (!email) {
      return {
        success: false,
        error: true,
        message: 'Email is required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    try {
      const response = await serverPOST(`${baseUrl}/auth/send-otp`, { email });

      // Success case
      if (!response.error) {
        return {
          success: true,
          message: 'OTP sent successfully! Please check your email.',
        };
      }

      // Handle error response
      const errorMessage = response.message || 'Failed to send OTP. Please try again.';
      const isUserNotFound = errorMessage.toLowerCase().includes('user not found') || 
                            errorMessage.toLowerCase().includes('not found');
      
      if (isUserNotFound) {
        return {
          success: false,
          error: true,
          message: 'The email provided does not exist on our records.',
        };
      }
      
      return {
        success: false,
        error: true,
        message: errorMessage,
      };
    } catch (err: any) {
      logger.error('Send OTP error:', err);
      
      // Check if the error is from the API (has error property)
      if (err?.error) {
        const errorMessage = err.message || 'Failed to send OTP. Please try again.';
        const isUserNotFound = errorMessage.toLowerCase().includes('user not found') || 
                              errorMessage.toLowerCase().includes('not found');
        
        if (isUserNotFound) {
          return {
            success: false,
            error: true,
            message: 'The email provided does not exist on our records.',
          };
        }
        
        return {
          success: false,
          error: true,
          message: errorMessage,
        };
      }
      
      // Network or other errors
      return {
        success: false,
        error: true,
        message: err instanceof Error ? err.message : 'Failed to send OTP. Please try again.',
      };
    }
  } catch (err: unknown) {
    logger.error('Send OTP error (outer catch):', err);
    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Server action to verify OTP
 */
export async function verifyOtpAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;

    if (!email || !otp) {
      return {
        success: false,
        error: true,
        message: 'Email and OTP are required',
      };
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid 6-digit OTP',
      };
    }

    const response = await serverPOST(`${baseUrl}/auth/verify-otp`, { email, otp });

    // Check only error flag, not data (data can be null on success)
    if (response.error) {
      return {
        success: false,
        error: true,
        message: response.message || 'Invalid OTP. Please try again.',
      };
    }

    // Success - even if data is null, if error is false, it's successful
    return {
      success: true,
      message: response.message || 'OTP verified successfully',
    };
  } catch (err: unknown) {
    logger.error('Verify OTP error:', err);
    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'Failed to verify OTP. Please try again.',
    };
  }
}

/**
 * Server action to update password
 */
export async function updatePasswordAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;
    const newPassword = formData.get('newPassword') as string;

    if (!email || !otp || !newPassword) {
      return {
        success: false,
        error: true,
        message: 'All fields are required',
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters long',
      };
    }

    const response = await serverPOST(`${baseUrl}/auth/update-password`, {
      email,
      otp,
      newPassword,
    });

    // Check only error flag, not data (data can be null on success)
    if (response.error) {
      return {
        success: false,
        error: true,
        message: response.message || 'Failed to update password. Please try again.',
      };
    }

    // Success - even if data is null, if error is false, it's successful
    return {
      success: true,
      message: response.message || 'Password updated successfully',
    };
  } catch (err: unknown) {
    logger.error('Update password error:', err);
    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'Failed to update password. Please try again.',
    };
  }
}

/**
 * Server action for user signup
 */
export async function signUpAction(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: true,
        message: 'All fields are required',
      };
    }

    if (fullName.trim().length < 2) {
      return {
        success: false,
        error: true,
        message: 'Full name must be at least 2 characters',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: true,
        message: 'Please enter a valid email address',
      };
    }

    // Password validation
    if (password.length < 8) {
      return {
        success: false,
        error: true,
        message: 'Password must be at least 8 characters',
      };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return {
        success: false,
        error: true,
        message: 'Password must contain at least one lowercase letter',
      };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        success: false,
        error: true,
        message: 'Password must contain at least one uppercase letter',
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        success: false,
        error: true,
        message: 'Password must contain at least one number',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: true,
        message: 'Passwords do not match',
      };
    }

    // Call API using server client (signup doesn't need auth token)
    const userData: IUser = {
      email: email.trim(),
      password: password,
      fullName: fullName.trim(),
      role: Role.CUSTOMER,
      isAccountBlocked: false,
      canReview: true,
      phone: '',
      isPhoneConfirmed: false,
    };

    const response = await serverPOST(`${baseUrl}/auth/signup`, userData);

    if (response.error || !response.data) {
      return {
        success: false,
        error: true,
        message: response.message || 'Sign up failed. Please try again.',
      };
    }

    // Store tokens in cookies (server-side)
    // Convert expiresAt string to Date object if needed
    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt 
        ? (typeof response.data.expiresAt === 'string' 
          ? new Date(response.data.expiresAt) 
          : response.data.expiresAt)
        : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours if not provided
    };

    const cookieStore = await cookies();
    cookieStore.set('userToken', JSON.stringify(tokenData), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false,
    });

    // Decode token to get user role for routing
    let redirectPath = '/profile';
    try {
      const decodedUser: IDecodedJWT = jwtDecode(response.data.accessToken);
      const role = decodedUser.role?.toLowerCase();

      if (role === Role.ADMIN || role === 'superadmin') {
        redirectPath = '/admin/dashboard';
      } else if (role === Role.VENDOR) {
        redirectPath = '/vendor/dashboard';
      } else if (role === Role.INFLUENCER) {
        redirectPath = '/influencer/dashboard';
      }
    } catch (decodeError) {
      logger.error('Error decoding token:', decodeError);
    }

    // Redirect on success
    redirect(redirectPath);
  } catch (err: unknown) {
    logger.error('Sign up error:', err);

    // Handle redirect errors gracefully
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err; // Re-throw redirect errors
    }

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
    };
  }
}
