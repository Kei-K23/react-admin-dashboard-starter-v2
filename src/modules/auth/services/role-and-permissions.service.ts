import type {
  PermissionEnum,
  PermissionModuleEnum,
} from "../../../common/constraints";
import type {
  BaseGetAllFilter,
  BaseResponse,
  ResponseGetAllMetaData,
} from "../../../common/interfaces/base-response";
import apiClient from "../../../lib/api";

export interface GetAllRolesResponse extends BaseResponse {
  data: Role[];
  meta: ResponseGetAllMetaData;
}

export interface GetRoleResponse extends BaseResponse {
  data: Role;
}

export interface GetAllPermissionsResponse extends BaseResponse {
  data: PermissionClass[];
}

export interface GetAllRolesParams extends BaseGetAllFilter {
  search?: string | undefined;
}

export interface RoleDeletedResponse extends BaseResponse {
  data: null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  rolePermissions: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: PermissionClass;
}

export interface PermissionClass {
  id: string;
  module: PermissionModuleEnum;
  permission: PermissionEnum;
}

export const roleAndPermissionsService = {
  getAllRoles: (params?: GetAllRolesParams) =>
    apiClient.get<GetAllRolesResponse>("/roles", params),

  getRoleById: (params: { id: string }) =>
    apiClient.get<GetRoleResponse>(`/roles/${params.id}`),

  getAllPermissions: () =>
    apiClient.get<GetAllPermissionsResponse>("/roles/permissions"),

  createRole: (data: {
    name: string;
    description: string;
    permissionIds: string[];
  }) => apiClient.post("/roles", data),

  updateRole: (payload: {
    id: string;
    name?: string;
    description?: string;
    permissionIds?: string[];
  }) => {
    const { id, ...data } = payload;
    return apiClient.patch<GetRoleResponse>(`/roles/${id}`, data);
  },

  deleteRole: (id: string) =>
    apiClient.delete<RoleDeletedResponse>(`/roles/${id}`),
};
