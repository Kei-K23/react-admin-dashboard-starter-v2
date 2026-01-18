import { SettingOutlined, TableOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import {
  type PermissionEnum,
  type PermissionModuleEnum,
  PERMISSION_MODULES,
  PERMISSION_ENUM,
} from "../common/constraints";

export interface NavigationItem {
  key: string;
  title: string;
  path?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  roles?: string[];
  permission?: {
    module: PermissionModuleEnum;
    type: PermissionEnum;
  };
}

export const navigationConfig: NavigationItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: <TableOutlined />,
  },
  {
    key: "administration",
    title: "Administration",
    icon: <SettingOutlined />,
    children: [
      {
        key: "users",
        title: "Users",
        path: "/dashboard/users",
        permission: {
          module: PERMISSION_MODULES.USERS,
          type: PERMISSION_ENUM.Read,
        },
      },
      {
        key: "roles&permissions",
        title: "Roles & Permissions",
        path: "/dashboard/roles-permissions",
        permission: {
          module: PERMISSION_MODULES.ROLES,
          type: PERMISSION_ENUM.Read,
        },
      },
      {
        key: "auditLogs",
        title: "Audit Logs",
        path: "/dashboard/audit-logs",
        permission: {
          module: PERMISSION_MODULES.ACTIVITY_LOGS,
          type: PERMISSION_ENUM.Read,
        },
      },
      {
        key: "activityLogs",
        title: "Activity Logs",
        path: "/dashboard/activity-logs",
        permission: {
          module: PERMISSION_MODULES.ACTIVITY_LOGS,
          type: PERMISSION_ENUM.Read,
        },
      },
    ],
  },
];
