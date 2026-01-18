import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import MainDashboardLayout from "./layouts/MainDashboardLayout";
import UserCreate from "./modules/auth/pages/users/create";
import UserEdit from "./modules/auth/pages/users/edit";
import RolesPermissionsCreate from "./modules/auth/pages/roles-permissions/create";
import RolesPermissionsEdit from "./modules/auth/pages/roles-permissions/edit";
import Users from "./modules/auth/pages/users";
import RolesPermissions from "./modules/auth/pages/roles-permissions";
import AuditLogs from "./modules/auth/pages/audit-logs";
import ActivityLogs from "./modules/auth/pages/activity-logs";
import Login from "./modules/auth/pages/login";
import Logout from "./modules/auth/pages/logout";
import Profile from "./modules/auth/pages/profile";
import EditProfile from "./modules/auth/pages/profile/edit";
import ChangePassword from "./modules/auth/pages/profile/change-password";
import { PermissionsGuard } from "./components/permissions-guard";
import { AuthGuard } from "./components/auth-guard";
import { GuestGuard } from "./components/guest-guard";
import { PERMISSION_ENUM, PERMISSION_MODULES } from "./common/constraints";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <MainDashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Home />,
      },
      {
        path: "/dashboard",
        children: [
          {
            path: "/dashboard/users",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.USERS}
                permission={PERMISSION_ENUM.Read}
              >
                <Users />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/logout",
            element: <Logout />,
          },
          {
            path: "/dashboard/profile",
            element: <Profile />,
          },
          {
            path: "/dashboard/profile/edit",
            element: <EditProfile />,
          },
          {
            path: "/dashboard/profile/change-password",
            element: <ChangePassword />,
          },
          {
            path: "/dashboard/users/create",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.USERS}
                permission={PERMISSION_ENUM.Create}
              >
                <UserCreate />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/users/edit/:id",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.USERS}
                permission={PERMISSION_ENUM.Update}
              >
                <UserEdit />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/roles-permissions",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.ROLES}
                permission={PERMISSION_ENUM.Read}
              >
                <RolesPermissions />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/roles-permissions/create",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.ROLES}
                permission={PERMISSION_ENUM.Create}
              >
                <RolesPermissionsCreate />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/roles-permissions/edit/:id",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.ROLES}
                permission={PERMISSION_ENUM.Update}
              >
                <RolesPermissionsEdit />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/audit-logs",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.ACTIVITY_LOGS}
                permission={PERMISSION_ENUM.Read}
              >
                <AuditLogs />
              </PermissionsGuard>
            ),
          },
          {
            path: "/dashboard/activity-logs",
            element: (
              <PermissionsGuard
                module={PERMISSION_MODULES.ACTIVITY_LOGS}
                permission={PERMISSION_ENUM.Read}
              >
                <ActivityLogs />
              </PermissionsGuard>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
