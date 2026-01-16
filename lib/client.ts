/* eslint-disable @typescript-eslint/no-explicit-any */
// client.ts - HTTP client with Bearer token authentication
import { Diagnostic } from "./logger";
import { getAccessToken } from "./ecryptUser";
import axios from "axios";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add Authorization header with Bearer token for all requests
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getFileHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };

  // Add Authorization header with Bearer token for file uploads
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(endPoint: string, options?: { page?: number; pageSize?: number; title?: string; params?: Record<string, any> } | undefined) {
  try {
    const response = await axios.get(endPoint, {
      headers: getHeaders(),
      withCredentials: true,
      decompress: true,
      responseType: 'json',
      params: options?.params // Add query parameters to the request
    });

    return response.data;
  } catch (error: any) {
    console.error(`[API ERROR: GET ${endPoint}]`, error.message);

    // Return consistent error format matching CustomResponse structure
    if (error.response?.data) {
      // If server returned structured error response
      throw error.response.data;
    } else if (error.response) {
      // If server returned error but no data
      throw {
        data: null,
        message: `Server error: ${error.response.status}`,
        error: true
      };
    } else {
      // Network error or other axios error
      throw {
        data: null,
        message: error.message || 'Network Error',
        error: true
      };
    }
  }
}

export async function PATCH(endPoint: string, payload?: object): Promise<any> {
  try {
    const result = await axios.patch(endPoint, payload, {
      headers: getHeaders(),
      withCredentials: true
    });

    Diagnostic("SUCCESS ON PATCH, returning", result);
    return result.data;
  } catch (error: any) {
    console.error(`[API ERROR: PATCH ${endPoint}]`, error.message);
    Diagnostic("ERROR ON PATCH, returning", error);

    // Consistent error format like PUT/POST
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.response) {
      throw {
        data: null,
        message: `Server error: ${error.response.status}`,
        error: true
      };
    } else {
      throw {
        data: null,
        message: error.message || 'Network Error',
        error: true
      };
    }
  }
}


export async function POST(endPoint: string, payload: object) {
  try {
    const result = await axios.post(endPoint, payload, {
      headers: getHeaders(),
      withCredentials: true
    });

    Diagnostic("SUCCESS ON POST, returning", result);
    return result.data;
  } catch (error: any) {
    console.log(`[API ERROR: Method: POST; Endpoint: ${endPoint}]`, error);
    Diagnostic("ERROR ON POST, returning", error);

    // FIXED: Throw the actual error response data
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw {
        message: error.message || 'Network Error',
        error: true
      };
    }
  }
}

export async function POSTFILES(endPoint: string, payload: object) {
  try {
    const result = await axios.post(endPoint, payload, {
      headers: getFileHeaders(),
      withCredentials: true
    });

    Diagnostic("SUCCESS ON POST FILES, returning", result);
    return result.data;
  } catch (error: any) {
    console.log(`[API ERROR: Method: POSTFILES; Endpoint: ${endPoint}]`, error);
    Diagnostic("ERROR ON POST FILES, returning", error);

    return error.response;
  }
}

export async function DELETE(endPoint: string, payload?: object): Promise<any> {
  try {
    const result = await axios.delete(endPoint, {
      headers: getHeaders(),
      withCredentials: true,
      data: payload // For DELETE requests with body
    });

    return result.data;
  } catch (error: any) {
    console.error(`[API ERROR: DELETE ${endPoint}]`, error.message);

    // Throw consistent error format
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.response) {
      throw {
        data: null,
        message: `Server error: ${error.response.status}`,
        error: true
      };
    } else {
      throw {
        data: null,
        message: error.message || 'Network Error',
        error: true
      };
    }
  }
}

export async function PUT(endPoint: string, payload?: object): Promise<any> {
  try {
    const result = await axios.put(endPoint, payload, {
      headers: getHeaders(),
      withCredentials: true
    });

    return result.data;
  } catch (error: any) {
    console.error(`[API ERROR: PUT ${endPoint}]`, error.message);

    // Throw consistent error format
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.response) {
      throw {
        data: null,
        message: `Server error: ${error.response.status}`,
        error: true
      };
    } else {
      throw {
        data: null,
        message: error.message || 'Network Error',
        error: true
      };
    }
  }
}
