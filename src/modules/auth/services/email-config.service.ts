import type { BaseResponse } from "../../../common/interfaces/base-response";
import apiClient from "../../../lib/api";

export interface GetEmailConfigResponse extends BaseResponse {
  data: EmailConfig | null;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUsername: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  smtpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const emailConfigService = {
  getEmailConfig: () => apiClient.get<GetEmailConfigResponse>(`/settings/smtp`),

  createOrUpdateEmailConfig: (data: {
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUsername: string;
    smtpPassword: string;
    smtpFromEmail: string;
    smtpFromName: string;
    smtpEnabled: boolean;
  }) => apiClient.post<GetEmailConfigResponse>("/settings/smtp", data),
};
