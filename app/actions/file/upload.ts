'use server';

import { serverPOSTFILES } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { CustomResponse } from '@/interfaces/response';
import { IFIleURL } from '@/interfaces/file';
import { logger } from '@/lib/log';

/**
 * Server action to upload files
 * Returns array of file URLs
 */
export async function uploadFilesAction(
  formData: FormData
): Promise<CustomResponse<IFIleURL[]>> {
  try {
    logger.info(`[Upload Files Action] Uploading files to ${baseUrl}/files/uploadFile`);
    const response = await serverPOSTFILES(`${baseUrl}/files/uploadFile`, formData);
    logger.info(`[Upload Files Action] Files uploaded successfully`);
    return response;
  } catch (err) {
    logger.error('[Upload Files Action] Error uploading files:', err);
    return {
      data: [] as IFIleURL[],
      message: err instanceof Error ? err.message : 'Failed to upload files',
      error: true,
    };
  }
}
