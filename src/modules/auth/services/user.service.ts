import type { Role } from "./role-and-permissions.service";
import type {
  BaseGetAllFilter,
  BaseResponse,
  ResponseGetAllMetaData,
} from "../../../common/interfaces/base-response";
import apiClient from "../../../lib/api";

export interface GetAllUsersResponse extends BaseResponse {
  data: UserWithRole[];
  meta: ResponseGetAllMetaData;
}

export interface GetAllUsersParams extends BaseGetAllFilter {
  isBanned?: "all" | "true" | "false" | undefined;
  roleId?: string | undefined;
  search?: string | undefined;
}

export interface GetUserResponse extends BaseResponse {
  data: UserWithRole;
}

export interface UserDeletedResponse extends BaseResponse {
  data: null;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isBanned: boolean;
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  twoFactorEnabled: boolean;
  roleId: string;
}

export interface UserWithRole {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isBanned: boolean;
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  twoFactorEnabled: boolean;
  roleId: string;
  role: Role;
}

export const userService = {
  getAllUsers: (params?: GetAllUsersParams) =>
    apiClient.get<GetAllUsersResponse>("/users", params),

  getUserById: (params: { id: string }) =>
    apiClient.get<GetUserResponse>(`/users/${params.id}`),

  createUser: (data: FormData) =>
    apiClient.post("/users", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateUser: (payload: { id: string; data: FormData }) => {
    const { id, data } = payload;
    return apiClient.patch<GetUserResponse>(`/users/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteUser: (id: string) =>
    apiClient.delete<UserDeletedResponse>(`/users/${id}`),
};
