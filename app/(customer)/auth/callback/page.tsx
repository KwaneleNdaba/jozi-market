'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { encryptToken } from '@/lib/ecryptUser';
import { IDecodedJWT, TokenData, Role } from '@/interfaces/auth/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');
  const error = searchParams.get('error');

  useEffect(() => {
    // Handle error case - redirect immediately
    if (error) {
      router.replace(`/signin?error=${encodeURIComponent(error)}`);
      return;
    }

    // Handle missing tokens - redirect immediately
    if (!token || !refreshToken) {
      router.replace('/signin?error=missing_tokens');
      return;
    }

    try {
      // Decode token to get user info and expiration
      const decodedToken: IDecodedJWT = jwtDecode(token);
      
      // Create token data object matching TokenData interface
      const tokenData: TokenData = {
        accessToken: token,
        refreshToken: refreshToken,
        expiresAt: new Date(decodedToken.exp * 1000), // Convert Unix timestamp to Date
      };

      // Store tokens in cookies
      encryptToken(tokenData);

      // Determine redirect path based on user role
      let redirectPath = '/profile';
      const role = decodedToken.role?.toLowerCase();

      if (role === Role.ADMIN || role === 'superadmin') {
        redirectPath = '/admin/dashboard';
      } else if (role === Role.VENDOR) {
        redirectPath = '/vendor/dashboard';
      } else if (role === Role.INFLUENCER) {
        redirectPath = '/influencer/dashboard';
      }

      // Redirect immediately
      router.replace(redirectPath);
    } catch (err) {
      console.error('Error processing OAuth callback:', err);
      router.replace('/signin?error=token_processing_failed');
    }
  }, [token, refreshToken, error, router]);

  // Return null - no UI, just processing and redirecting
  return null;
}
