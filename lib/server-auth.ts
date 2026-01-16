'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { IDecodedJWT, TokenData } from '@/interfaces/auth/auth';

/**
 * SERVER-SIDE AUTHENTICATION UTILITIES
 * 
 * These functions are the server-side equivalents of the client-side functions in ecryptUser.ts
 * Use these in Server Actions, Server Components, and API Routes.
 * 
 * IMPORTANT: Never import client-side functions (from ecryptUser.ts) in server-side code.
 * Instead, use these server-side functions.
 * 
 * Example usage in a Server Action:
 * ```typescript
 * 'use server';
 * import { getServerAccessToken } from '@/lib/server-auth';
 * 
 * export async function myServerAction() {
 *   const token = await getServerAccessToken();
 *   if (!token) {
 *     return { error: 'Not authenticated' };
 *   }
 *   // Use token for API calls...
 * }
 * ```
 */

/**
 * Server-side function to get the access token from cookies
 * This is the server-side equivalent of getAccessToken() from ecryptUser.ts
 */
export async function getServerAccessToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const userTokenCookie = cookieStore.get('userToken');

    if (!userTokenCookie?.value) {
      return undefined;
    }

    // Parse the cookie value (it's stored as JSON string)
    const tokenData: TokenData = JSON.parse(userTokenCookie.value);
    return tokenData.accessToken;
  } catch (error) {
    console.error('Error getting server access token:', error);
    return undefined;
  }
}

/**
 * Server-side function to get the refresh token from cookies
 */
export async function getServerRefreshToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const userTokenCookie = cookieStore.get('userToken');

    if (!userTokenCookie?.value) {
      return undefined;
    }

    const tokenData: TokenData = JSON.parse(userTokenCookie.value);
    return tokenData.refreshToken;
  } catch (error) {
    console.error('Error getting server refresh token:', error);
    return undefined;
  }
}

/**
 * Server-side function to decode the access token and get user info
 */
export async function decodeServerAccessToken(): Promise<IDecodedJWT | undefined> {
  try {
    const accessToken = await getServerAccessToken();
    if (!accessToken) {
      return undefined;
    }

    const decodedUser: IDecodedJWT = jwtDecode(accessToken);
    return decodedUser;
  } catch (error) {
    console.error('Error decoding server access token:', error);
    return undefined;
  }
}

/**
 * Server-side function to get the full token data from cookies
 */
export async function getServerTokenData(): Promise<TokenData | undefined> {
  try {
    const cookieStore = await cookies();
    const userTokenCookie = cookieStore.get('userToken');

    if (!userTokenCookie?.value) {
      return undefined;
    }

    const tokenData: TokenData = JSON.parse(userTokenCookie.value);
    return tokenData;
  } catch (error) {
    console.error('Error getting server token data:', error);
    return undefined;
  }
}
