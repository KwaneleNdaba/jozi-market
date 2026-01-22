import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IUpdatePassword, IUser, IUserLogin, TokenData, IVendorWithApplication } from "@/interfaces/auth/auth";
import { GET, POST, PUT } from "@/lib/client";
import { logger } from "@/lib/log";

const AuthbaseURL = `${baseUrl}/auth`

export const AUTH_API = {

  // Authentication endpoints (matching backend routes)
  SIGNUP_POST: async (userData: IUser): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Signing up user: ${userData.email}`);
      const response = await POST(`${AuthbaseURL}/signup`, userData);
      logger.info(`[AUTH_API] Signup successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error during signup:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to sign up",
        error: true,
      };
    }
  },

  LOGIN_POST: async (userData: IUserLogin): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Logging in user: ${userData.email}`);
      const response = await POST(`${AuthbaseURL}/login`, userData);
      logger.info(`[AUTH_API] Login successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error during login:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to login",
        error: true,
      };
    }
  },

  REFRESH_TOKEN: async (): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Refreshing token`);
      const response = await POST(`${AuthbaseURL}/refreshtoken`, {});
      logger.info(`[AUTH_API] Token refresh successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error refreshing token:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to refresh token",
        error: true,
      };
    }
  },

  // User management endpoints (matching backend routes)
  UPDATE_USER: async (userData: Partial<IUser>): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Updating user`);
      const response = await PUT(`${AuthbaseURL}/updateUser`, userData);
      logger.info(`[AUTH_API] User update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating user:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update user",
        error: true,
      };
    }
  },

  UPDATE_PROFILE: async (profileData: { fullName?: string; phone?: string; profileUrl?: string }): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Updating profile`);
      const response = await PUT(`${AuthbaseURL}/update-profile`, profileData);
      logger.info(`[AUTH_API] Profile update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating profile:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update profile",
        error: true,
      };
    }
  },

  UPDATE_PROFILE_PICTURE: async (profileUrl: string): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Updating profile picture`);
      const response = await PUT(`${AuthbaseURL}/update-profile`, { profileUrl });
      logger.info(`[AUTH_API] Profile picture update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating profile picture:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update profile picture",
        error: true,
      };
    }
  },

  UPDATE_ADDRESS: async (data: any): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Updating address`);
      const response = await PUT(`${AuthbaseURL}/update-address`, data);
      logger.info(`[AUTH_API] Address update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating address:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update address",
        error: true,
      };
    }
  },

  // OTP and password reset endpoints (matching backend routes)
  SEND_OTP: async (data: { email: string }): Promise<CustomResponse<{ otp: string; fullName: string }>> => {
    try {
      logger.info(`[AUTH_API] Sending OTP to ${data.email}`);
      const response = await POST(`${AuthbaseURL}/send-otp`, data);
      logger.info(`[AUTH_API] OTP sent successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error sending OTP:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to send OTP",
        error: true,
      };
    }
  },

  VERIFY_OTP: async (data: { email: string; otp: string }): Promise<CustomResponse<string>> => {
    try {
      logger.info(`[AUTH_API] Verifying OTP for ${data.email}`);
      const response = await POST(`${AuthbaseURL}/verify-otp`, data);
      logger.info(`[AUTH_API] OTP verification successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error verifying OTP:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to verify OTP",
        error: true,
      };
    }
  },

    GET_USER: async (userId : string): Promise<CustomResponse<IUser | IVendorWithApplication>> => {
    try {
      logger.info(`[AUTH_API] Getting user ${userId}`);
      const response = await GET(`${AuthbaseURL}/getUser/${userId}`);
      logger.info(`[AUTH_API] User retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error getting user:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to get user",
        error: true,
      };
    }
  },

  UPDATE_PASSWORD: async (data: { email: string; otp: string; newPassword: string }): Promise<CustomResponse<TokenData>> => {
    try {
      logger.info(`[AUTH_API] Updating password for ${data.email}`);
      const response = await POST(`${AuthbaseURL}/update-password`, data);
      logger.info(`[AUTH_API] Password update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating password:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update password",
        error: true,
      };
    }
  },
  GET_ALL_USERS: async (): Promise<CustomResponse<IUser[]>> => {
    try {
      logger.info(`[AUTH_API] Getting all users`);
      const response = await GET(`${AuthbaseURL}/getAllUsers`);
      logger.info(`[AUTH_API] Users retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error getting all users:", err);
      return {
        data: [] as IUser[],
        message: err instanceof Error ? err.message : "Failed to get users",
        error: true,
      };
    }
  },
  GET_ALL_DRIVERS: async (): Promise<CustomResponse<IUser[]>> => {
    try {
      logger.info(`[AUTH_API] Getting all drivers`);
      const response = await GET(`${AuthbaseURL}/getAllDrivers`);
      logger.info(`[AUTH_API] Drivers retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error getting all drivers:", err);
      return {
        data: [] as IUser[],
        message: err instanceof Error ? err.message : "Failed to get drivers",
        error: true,
      };
    }
  },

  GET_ALL_STAFF: async (): Promise<CustomResponse<IUser[]>> => {
    try {
      logger.info(`[AUTH_API] Getting all staff`);
      const response = await GET(`${AuthbaseURL}/getStaffUsers`);
      logger.info(`[AUTH_API] Staff retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error getting all staff:", err);
      return {
        data: [] as IUser[],
        message: err instanceof Error ? err.message : "Failed to get staff",
        error: true,
      };
    }
  },
  BLOCK_USER_ACCOUNT: async (userId: string): Promise<CustomResponse<IUser>> => {
    try {
      logger.info(`[AUTH_API] Blocking user account ${userId}`);
      const response = await PUT(`${AuthbaseURL}/${userId}/block`);
      logger.info(`[AUTH_API] User account blocked successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error blocking user account:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to block user account",
        error: true,
      };
    }
  },

  UNBLOCK_USER_ACCOUNT: async (userId: string): Promise<CustomResponse<IUser>> => {
    try {
      logger.info(`[AUTH_API] Unblocking user account ${userId}`);
      const response = await PUT(`${AuthbaseURL}/${userId}/unblock`);
      logger.info(`[AUTH_API] User account unblocked successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error unblocking user account:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to unblock user account",
        error: true,
      };
    }
  }
,

  UPDATE_OLD_PASSWORD: async (data: IUpdatePassword): Promise<CustomResponse<IUser>> => {
    try {
      logger.info(`[AUTH_API] Updating old password for user ${data.userId}`);
      const response = await PUT(`${AuthbaseURL}/update-old-password`,data);
      logger.info(`[AUTH_API] Old password update successful`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error updating old password:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update old password",
        error: true,
      };
    }
  },

  ACTIVATE_STORE: async (userId: string): Promise<CustomResponse<IUser>> => {
    try {
      logger.info(`[AUTH_API] Activating store for user ${userId}`);
      const response = await PUT(`${AuthbaseURL}/${userId}/store/activate`, {});
      logger.info(`[AUTH_API] Store activated successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error activating store:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to activate store",
        error: true,
      };
    }
  },

  DEACTIVATE_STORE: async (userId: string): Promise<CustomResponse<IUser>> => {
    try {
      logger.info(`[AUTH_API] Deactivating store for user ${userId}`);
      const response = await PUT(`${AuthbaseURL}/${userId}/store/deactivate`, {});
      logger.info(`[AUTH_API] Store deactivated successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error deactivating store:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to deactivate store",
        error: true,
      };
    }
  },

  /**
   * Get active vendors with products (public endpoint)
   * Returns vendors with active subscriptions and their product counts
   */
  GET_ACTIVE_VENDORS: async (): Promise<CustomResponse<IVendorWithApplication[]>> => {
    try {
      logger.info(`[AUTH_API] Getting active vendors with products`);
      const response = await GET(`${AuthbaseURL}/vendors/active`);
      logger.info(`[AUTH_API] Active vendors retrieved successfully`);
      return response;
    } catch (err) {
      logger.error("[AUTH_API] Error getting active vendors:", err);
      return {
        data: [] as IVendorWithApplication[],
        message: err instanceof Error ? err.message : "Failed to get active vendors",
        error: true,
      };
    }
  }

};