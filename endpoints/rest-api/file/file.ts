import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IFIleURL } from "@/interfaces/file";
import { POSTFILES } from "@/lib/client";
import { logger } from "@/lib/log";

const FilebaseURL = `${baseUrl}/files`

export const FILE_API = {

    UPLOAD_FILE: async (formData: FormData): Promise<CustomResponse<IFIleURL[]>> => {
        try {
            logger.info(`[FILE_API] Uploading file to ${FilebaseURL}/uploadFile`);
            const response = await POSTFILES(`${FilebaseURL}/uploadFile`, formData);
            logger.info(`[FILE_API] File upload successful`);
            return response;
        } catch (err) {
            logger.error("[FILE_API] Error uploading file:", err);
            return {
                data: [] as IFIleURL[],
                message: err instanceof Error ? err.message : "Failed to upload file",
                error: true,
            };
        }
    },


};