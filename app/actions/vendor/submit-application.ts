'use server';

import { createVendorApplicationAction } from './application';
import { ICreateVendorApplication, IVendorApplication, mapVendorTypeToBackend } from '@/interfaces/vendor/vendor';
import { CustomResponse } from '@/interfaces/response';
import { decodeServerAccessToken } from '@/lib/server-auth';
import { logger } from '@/lib/log';

export interface VendorApplicationFormResult {
  success: boolean;
  message?: string;
  error?: boolean;
  data?: IVendorApplication;
}

/**
 * Server action for submitting vendor application form
 * Can be used with useActionState hook
 */
export async function submitVendorApplicationAction(
  _prevState: VendorApplicationFormResult | null,
  formData: FormData
): Promise<VendorApplicationFormResult> {
  try {
    // Get user ID from token if available
    const decodedUser = await decodeServerAccessToken();
    const userId = decodedUser?.id || null;

    // Extract form data
    const vendorType = formData.get('vendorType') as string;
    const legalName = formData.get('legalName') as string;
    const shopName = formData.get('shopName') as string;
    const contactPerson = formData.get('contactPerson') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;
    const website = formData.get('website') as string || undefined;
    const tagline = formData.get('tagline') as string || undefined;
    const cipcNumber = formData.get('cipcNumber') as string || undefined;
    const vatNumber = formData.get('vatNumber') as string || undefined;
    const productCount = formData.get('productCount') as string;
    const fulfillment = formData.get('fulfillment') as string;
    const address = JSON.parse(formData.get('address') as string || '{}');
    const files = JSON.parse(formData.get('files') as string || '{}');
    const agreements = JSON.parse(formData.get('agreements') as string || '{}');

    // Validation
    if (!vendorType || !legalName || !shopName || !contactPerson || !email || !phone) {
      return {
        success: false,
        error: true,
        message: 'Please fill in all required fields',
      };
    }

    if (!description || description.length < 50) {
      return {
        success: false,
        error: true,
        message: 'Description must be at least 50 characters',
      };
    }

    if (!address.street || !address.city || !address.postal || !address.country) {
      return {
        success: false,
        error: true,
        message: 'Please provide a complete address',
      };
    }

    // Validate required files
    if (!files.idDocUrl || !files.bankProofUrl) {
      return {
        success: false,
        error: true,
        message: 'Please upload required documents (ID and Bank Proof)',
      };
    }

    // Validate CIPC doc for Registered Business
    if (vendorType === 'Registered Business' && !files.cipcDocUrl) {
      return {
        success: false,
        error: true,
        message: 'CIPC registration document is required for registered businesses',
      };
    }

    // Validate agreements
    if (!agreements.terms || !agreements.privacy || !agreements.popia || !agreements.policies) {
      return {
        success: false,
        error: true,
        message: 'Please accept all required agreements',
      };
    }

    // Map vendorType: Frontend uses "Registered Business" but backend expects "Business"
    const mappedVendorType = mapVendorTypeToBackend(vendorType);

    // Prepare application data
    const applicationData: ICreateVendorApplication = {
      userId,
      vendorType: mappedVendorType,
      legalName,
      shopName,
      contactPerson,
      email,
      phone,
      description,
      website,
      tagline,
      cipcNumber: vendorType === 'Registered Business' ? cipcNumber : null,
      vatNumber,
      productCount,
      fulfillment,
      address,
      deliveryRegions: [], // Empty array as delivery regions are not collected
      files: {
        logoUrl: files.logoUrl,
        bannerUrl: files.bannerUrl,
        idDocUrl: files.idDocUrl,
        bankProofUrl: files.bankProofUrl,
        addressProofUrl: files.addressProofUrl,
        cipcDocUrl: files.cipcDocUrl,
      },
      agreements,
    };

    // Log the data being sent
    logger.info('[Submit Vendor Application] Prepared data summary:', {
      vendorType: applicationData.vendorType,
      shopName: applicationData.shopName,
      email: applicationData.email,
      hasFiles: !!applicationData.files,
      fileKeys: Object.keys(applicationData.files || {}),
      agreements: applicationData.agreements,
    });
    
    logger.info('[Submit Vendor Application] Full application data payload:', JSON.stringify(applicationData, null, 2));

    // Submit application
    const response: CustomResponse<IVendorApplication> = await createVendorApplicationAction(applicationData);

    logger.info('[Submit Vendor Application] Response:', {
      error: response?.error,
      message: response?.message,
      hasData: !!response?.data,
      dataId: response?.data?.id,
      fullResponse: JSON.stringify(response, null, 2),
    });

    // Check for errors - be more strict about what constitutes success
    if (response?.error === true || !response?.data || (response?.error !== false && !response?.data)) {
      logger.error('[Submit Vendor Application] Failed:', {
        error: response?.error,
        message: response?.message,
        hasData: !!response?.data,
        response,
      });
      return {
        success: false,
        error: true,
        message: response?.message || 'Failed to submit application. Please try again.',
      };
    }

    // Double-check that we have valid data
    if (!response.data || !response.data.id) {
      logger.error('[Submit Vendor Application] Missing application ID:', response);
      return {
        success: false,
        error: true,
        message: 'Application submitted but no ID returned. Please contact support.',
      };
    }

    logger.info(`[Submit Vendor Application] Success: Application ${response.data.id} submitted`);
    return {
      success: true,
      message: response.message || 'Application submitted successfully',
      data: response.data,
    };
  } catch (err) {
    logger.error('[Submit Vendor Application] Exception:', err);

    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred while submitting your application. Please try again.',
    };
  }
}
