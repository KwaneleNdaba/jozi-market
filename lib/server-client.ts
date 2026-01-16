'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * SERVER-SIDE HTTP CLIENT
 * 
 * This file provides server-side HTTP client functions that can be used in:
 * - Server Actions ('use server')
 * - Server Components
 * - API Routes
 * 
 * These functions automatically include the Bearer token from cookies.
 * 
 * IMPORTANT: Do NOT use the client-side functions from lib/client.ts in server-side code.
 * Use these server-side functions instead.
 * 
 * Example usage in a Server Action:
 * ```typescript
 * 'use server';
 * import { serverGET, serverPOST } from '@/lib/server-client';
 * 
 * export async function fetchUserData() {
 *   const data = await serverGET('/api/users/profile');
 *   return data;
 * }
 * 
 * export async function updateProfile(formData: FormData) {
 *   const payload = Object.fromEntries(formData);
 *   const result = await serverPOST('/api/users/profile', payload);
 *   return result;
 * }
 * ```
 */
import { getServerAccessToken } from './server-auth';
import { logger } from '@/lib/log';

/**
 * Get headers with Bearer token for server-side requests
 */
async function getServerHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header with Bearer token for all requests
  const token = await getServerAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Get headers for file uploads
 */
async function getServerFileHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  const token = await getServerAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Server-side GET request
 */
export async function serverGET(
  endPoint: string,
  options?: { page?: number; pageSize?: number; title?: string; params?: Record<string, any> }
) {
  try {
    const headers = await getServerHeaders();
    
    // Build URL with query parameters
    let url: URL;
    try {
      // Try to parse as absolute URL first
      url = new URL(endPoint);
    } catch {
      // If it's a relative URL, use base URL from env or default
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:8000';
      url = new URL(endPoint, baseUrl);
    }
    
    // Add query parameters if provided
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    logger.info(`[SERVER GET] Endpoint: ${url.toString()}`);
    logger.info(`[SERVER GET] Headers:`, headers);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    logger.info(`[SERVER GET] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json();
    logger.info(`[SERVER GET] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: GET ${endPoint}]`, err);

    if (err.error) {
      throw err;
    } else {
      throw {
        data: null,
        message: err.message || 'Network Error',
        error: true,
      };
    }
  }
}

/**
 * Server-side POST request
 */
export async function serverPOST(endPoint: string, payload: object) {
  try {
    const headers = await getServerHeaders();
    
    logger.info(`[SERVER POST] Endpoint: ${endPoint}`);
    logger.info(`[SERVER POST] Headers:`, headers);
    logger.info(`[SERVER POST] Payload:`, JSON.stringify(payload, null, 2));
    
    const response = await fetch(endPoint, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    logger.info(`[SERVER POST] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json();
    logger.info(`[SERVER POST] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: POST ${endPoint}]`, {
      message: err?.message,
      status: err?.status,
      statusText: err?.statusText,
      responseData: err?.data,
      fullError: err,
    });

    if (err.error) {
      throw err;
    } else {
      throw {
        data: null,
        message: err.message || 'Network Error',
        error: true,
      };
    }
  }
}

/**
 * Server-side PATCH request
 */
export async function serverPATCH(endPoint: string, payload?: object): Promise<any> {
  try {
    const headers = await getServerHeaders();
    
    logger.info(`[SERVER PATCH] Endpoint: ${endPoint}`);
    logger.info(`[SERVER PATCH] Payload:`, payload ? JSON.stringify(payload, null, 2) : 'No payload');

    const response = await fetch(endPoint, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: payload ? JSON.stringify(payload) : undefined,
    });

    logger.info(`[SERVER PATCH] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json();
    logger.info(`[SERVER PATCH] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: PATCH ${endPoint}]`, err);

    if (err.error) {
      throw err;
    } else {
      throw {
        data: null,
        message: err.message || 'Network Error',
        error: true,
      };
    }
  }
}

/**
 * Server-side PUT request
 */
export async function serverPUT(endPoint: string, payload?: object): Promise<any> {
  try {
    const headers = await getServerHeaders();
    
    logger.info(`[SERVER PUT] Endpoint: ${endPoint}`);
    logger.info(`[SERVER PUT] Payload:`, payload ? JSON.stringify(payload, null, 2) : 'No payload');

    const response = await fetch(endPoint, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: payload ? JSON.stringify(payload) : undefined,
    });

    logger.info(`[SERVER PUT] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json();
    logger.info(`[SERVER PUT] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: PUT ${endPoint}]`, err);

    if (err.error) {
      throw err;
    } else {
      throw {
        data: null,
        message: err.message || 'Network Error',
        error: true,
      };
    }
  }
}

/**
 * Server-side DELETE request
 */
export async function serverDELETE(endPoint: string, payload?: object): Promise<any> {
  try {
    const headers = await getServerHeaders();
    
    logger.info(`[SERVER DELETE] Endpoint: ${endPoint}`);
    logger.info(`[SERVER DELETE] Payload:`, payload ? JSON.stringify(payload, null, 2) : 'No payload');

    const response = await fetch(endPoint, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      body: payload ? JSON.stringify(payload) : undefined,
    });

    logger.info(`[SERVER DELETE] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json().catch(() => null);
    logger.info(`[SERVER DELETE] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: DELETE ${endPoint}]`, err);

    if (err.error) {
      throw err;
    } else {
      throw {
        data: null,
        message: err.message || 'Network Error',
        error: true,
      };
    }
  }
}

/**
 * Server-side file upload (POST with multipart/form-data)
 */
export async function serverPOSTFILES(endPoint: string, payload: FormData | object) {
  try {
    const headers = await getServerFileHeaders();
    
    // Remove Content-Type header for FormData - browser will set it with boundary
    const fetchHeaders: Record<string, string> = {};
    if (headers.Authorization) {
      fetchHeaders.Authorization = headers.Authorization;
    }
    
    logger.info(`[SERVER POSTFILES] Endpoint: ${endPoint}`);
    logger.info(`[SERVER POSTFILES] Payload type: ${payload instanceof FormData ? 'FormData' : 'object'}`);

    const response = await fetch(endPoint, {
      method: 'POST',
      headers: fetchHeaders,
      credentials: 'include',
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    logger.info(`[SERVER POSTFILES] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(`[SERVER POSTFILES] Error response:`, errorData);
      throw {
        data: null,
        message: errorData.message || `Server error: ${response.status}`,
        error: true,
      };
    }

    const data = await response.json();
    logger.info(`[SERVER POSTFILES] Response Data:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    logger.error(`[SERVER API ERROR: POSTFILES ${endPoint}]`, err);
    
    if (err.error) {
      return err;
    } else {
      return {
        data: null,
        message: err.message || 'Failed to upload files',
        error: true,
      };
    }
  }
}
