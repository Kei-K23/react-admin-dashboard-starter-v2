import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import {
  authService,
  type GetAllAuditLogParams,
  type GetAllAuditLogResponse,
  type GetProfileResponse,
} from "../services/auth.service";
import { createMutationHook } from "../../../hooks/use-mutation-factory";
import { createQueryHook } from "../../../hooks/use-query-factory";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../../../common/constraints";
import { App } from "antd";

export const useLogin = createMutationHook(authService.login);

export const useForgotPasswordRequest = createMutationHook(
  authService.forgotPasswordRequest
);
export const useForgotPasswordVerify = createMutationHook(
  authService.forgotPasswordVerify
);
export const useResetPassword = createMutationHook(authService.resetPassword);

export const useProfile = createQueryHook<GetProfileResponse>(
  ["auth", "profile"],
  authService.getProfile as never,
  {
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      const status = error.response.data.statusCode;
      if (status === 401) return false;
      return failureCount < 3;
    },
    enabled: Boolean(Cookies.get(ACCESS_TOKEN_KEY)),
  }
);

export const useGetAllAuditLogs = (params?: GetAllAuditLogParams) =>
  createQueryHook<GetAllAuditLogResponse>(
    ["audit-logs", JSON.stringify(params)],
    authService.getAllAuditLogs as never
  );

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    queryClient.clear();
    message.open({
      type: "success",
      content: "Logout successful",
    });
    navigate("/login", { replace: true });
  };
};

export const useAuthStatus = () => {
  const isAuthenticated = Boolean(Cookies.get(ACCESS_TOKEN_KEY));
  return { isAuthenticated };
};
