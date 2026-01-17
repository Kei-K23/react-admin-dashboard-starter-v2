import { createMutationHook } from "../../../hooks/use-mutation-factory";
import { createQueryHook } from "../../../hooks/use-query-factory";
import {
  userService,
  type GetAllUsersParams,
  type GetAllUsersResponse,
  type GetUserResponse,
} from "../services/user.service";

export const useGetAllUsers = (params?: GetAllUsersParams) =>
  createQueryHook<GetAllUsersResponse>(
    ["users", JSON.stringify(params)],
    userService.getAllUsers as never
  );

export const useGetUserById = (id: string) =>
  createQueryHook<GetUserResponse>(
    ["users", "detail", id],
    userService.getUserById as never
  );

export const useCreateUser = createMutationHook(userService.createUser);

export const useDeleteUser = createMutationHook(userService.deleteUser, {
  invalidateQueries: [["users"]],
});

export const useUpdateUser = createMutationHook(userService.updateUser);
