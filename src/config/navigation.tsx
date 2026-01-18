import { SettingOutlined, TableOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

export interface NavigationItem {
  key: string;
  title: string;
  path?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  roles?: string[];
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
      },
      {
        key: "roles&permissions",
        title: "Roles & Permissions",
        path: "/dashboard/roles-permissions",
      },
      {
        key: "auditLogs",
        title: "Audit Logs",
        path: "/dashboard/audit-logs",
      },
      {
        key: "activityLogs",
        title: "Activity Logs",
        path: "/dashboard/activity-logs",
      },
    ],
  },
];
