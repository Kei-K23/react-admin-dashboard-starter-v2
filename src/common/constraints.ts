const PERMISSION_MODULES = {
  USERS: "Users",
  ROLES: "Roles",
  ACTIVITY_LOGS: "Activity_Logs",
  SETTINGS: "Settings",
  CUSTOMERS: "Customers",
  SITE_CONFIGS: "Site_Configs",
  BANNERS: "Banners",
} as const;
export type PermissionModuleEnum =
  (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

const PERMISSION_ENUM = {
  Create: "CREATE",
  Delete: "DELETE",
  Read: "READ",
  Update: "UPDATE",
} as const;
export type PermissionEnum =
  (typeof PERMISSION_ENUM)[keyof typeof PERMISSION_ENUM];

const appName = import.meta.env.VITE_APP_NAME?.toLowerCase() || "app";
const ACCESS_TOKEN_KEY = `${appName}_accessToken`;
const REFRESH_TOKEN_KEY = `${appName}_refreshToken`;
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const API_APP_KEY = import.meta.env.VITE_API_APP_KEY || "";

export {
  PERMISSION_MODULES,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PERMISSION_ENUM,
  BASE_URL,
  API_APP_KEY,
};
