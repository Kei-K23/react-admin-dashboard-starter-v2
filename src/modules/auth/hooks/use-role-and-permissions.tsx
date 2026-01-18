import type { PermissionEnum } from "../../../common/constraints";
import { createMutationHook } from "../../../hooks/use-mutation-factory";
import { createQueryHook } from "../../../hooks/use-query-factory";
import {
  roleAndPermissionsService,
  type GetAllRolesParams,
  type GetAllPermissionsResponse,
  type GetAllRolesResponse,
  type GetRoleResponse,
} from "../services/role-and-permissions.service";
import type { UserWithRole } from "../services/user.service";

export const useGetAllRoles = (params?: GetAllRolesParams) =>
  createQueryHook<GetAllRolesResponse>(
    ["roles", JSON.stringify(params)],
    roleAndPermissionsService.getAllRoles as never,
  );

export const useGetRoleById = (id: string) =>
  createQueryHook<GetRoleResponse>(
    ["roles", "detail", id],
    roleAndPermissionsService.getRoleById as never,
  );

export const useGetAllPermissions = createQueryHook<GetAllPermissionsResponse>(
  ["roles", "permissions"],
  roleAndPermissionsService.getAllPermissions as never,
);

export const useCreateRole = createMutationHook(
  roleAndPermissionsService.createRole,
  {
    invalidateQueries: [["roles"]],
  },
);

export const useDeleteRole = createMutationHook(
  roleAndPermissionsService.deleteRole,
  {
    invalidateQueries: [["roles"]],
  },
);

export const useUpdateRole = createMutationHook(
  roleAndPermissionsService.updateRole,
  {
    invalidateQueries: [["roles"]],
  },
);

export const hasPermission = (
  user: UserWithRole | undefined,
  module: string,
  permission: PermissionEnum,
) => {
  if (!user?.role?.rolePermissions) return false;
  return user.role.rolePermissions.some(
    (rp) =>
      rp.permission.module === module &&
      rp.permission.permission === permission,
  );
};
