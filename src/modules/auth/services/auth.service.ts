import type { User, UserWithRole } from "./user.service";
import type {
  BaseGetAllFilter,
  BaseResponse,
  ResponseGetAllMetaData,
} from "../../../common/interfaces/base-response";
import apiClient from "../../../lib/api";

export interface LoginResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    user: {
      id: string;
    };
  };
}

export interface RefreshResponse extends BaseResponse {
  data: {
    accessToken: string;
    accessTokenExpiresAt: string;
    user: {
      id: string;
    };
  };
}

export interface ForgotPasswordRequestResponse extends BaseResponse {
  data: {
    userId: string;
  };
}
export interface ForgotPasswordVerifyResponse extends BaseResponse {
  data: {
    userId: string;
    accessToken: string;
  };
}
export interface ResetPasswordResponse extends BaseResponse {
  data: null;
}

export interface ChangePasswordResponse extends BaseResponse {
  data: null;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  customer?: User;
  action: string;
  description: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  location: null;
  isActivityLog: true;
  metadata: null;
  createdAt: string;
}

export interface GetProfileResponse extends BaseResponse {
  data: UserWithRole;
}

export interface GetAllAuditLogResponse extends BaseResponse {
  data: AuditLog[];
  meta: ResponseGetAllMetaData;
}

export interface GetAllAuditLogParams extends BaseGetAllFilter {
  isActivityLog?: boolean | undefined;
}

export const authService = {
  getProfile: () => apiClient.get<GetProfileResponse>("/auth/profile"),
  login: (data: { email: string; password: string }) =>
    apiClient.post<LoginResponse>("/auth/login", data),
  refresh: (refreshToken: string) =>
    apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken }),
  getAllAuditLogs: (params: GetAllAuditLogParams) =>
    apiClient.get<GetAllAuditLogResponse>("/activity-logs", params),
  forgotPasswordRequest: (data: { email: string }) =>
    apiClient.post<ForgotPasswordRequestResponse>(
      "/auth/otp/send/forgot-password",
      data
    ),
  forgotPasswordVerify: (data: { userId: string; code: string }) =>
    apiClient.post<ForgotPasswordVerifyResponse>(
      "/auth/otp/verify/forgot-password",
      data
    ),
  resetPassword: (data: { accessToken: string; newPassword: string }) =>
    apiClient.post<ResetPasswordResponse>("/auth/reset-password", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.patch<ChangePasswordResponse>("/auth/change-password", data),
};
