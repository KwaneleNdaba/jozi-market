import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { PaymentRequest, PaymentResponse, PaymentStatusResponse } from "@/interfaces/payfast/payfast";
import { POST, GET } from "@/lib/client";
import { logger } from "@/lib/log";

const PayFastBaseURL = `${baseUrl}/payfast`;

export const PAYFAST_API = {
  /**
   * Generate payment URL from cart (authenticated users only)
   */
  GENERATE_PAYMENT: async (request: PaymentRequest): Promise<CustomResponse<PaymentResponse>> => {
    try {
      logger.info(`[PAYFAST_API] Generating payment for user: ${request.userId}`);
      const response = await POST(`${PayFastBaseURL}/generate-payment`, request);
      logger.info(`[PAYFAST_API] Payment URL generated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PAYFAST_API] Error generating payment:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to generate payment",
        error: true,
      };
    }
  },

  /**
   * Handle PayFast ITN webhook (no auth required - PayFast calls this)
   * Note: This is typically called by PayFast, not directly by the frontend
   */
  HANDLE_ITN: async (itnData: any): Promise<CustomResponse<{
    success: boolean;
    order?: any;
    message: string;
  }>> => {
    try {
      logger.info(`[PAYFAST_API] Handling ITN notification`);
      const response = await POST(`${PayFastBaseURL}/notification`, itnData);
      logger.info(`[PAYFAST_API] ITN handled successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PAYFAST_API] Error handling ITN:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to handle ITN",
        error: true,
      };
    }
  },

  /**
   * Check payment status (authenticated users only)
   */
  CHECK_PAYMENT_STATUS: async (paymentReference: string): Promise<CustomResponse<PaymentStatusResponse>> => {
    try {
      logger.info(`[PAYFAST_API] Checking payment status for: ${paymentReference}`);
      const response = await GET(`${PayFastBaseURL}/status/${paymentReference}`);
      logger.info(`[PAYFAST_API] Payment status checked successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PAYFAST_API] Error checking payment status:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to check payment status",
        error: true,
      };
    }
  },
};
