import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import MainDashboardLayout from "./layouts/MainDashboardLayout";
import UserCreate from "./modules/auth/pages/users/create";
import UserEdit from "./modules/auth/pages/users/edit";
import RolesPermissionsCreate from "./modules/auth/pages/roles-permissions/create";
import Users from "./modules/auth/pages/users";
import RolesPermissions from "./modules/auth/pages/roles-permissions";
import Login from "./modules/auth/pages/login";
import Logout from "./modules/auth/pages/logout";
import Profile from "./modules/auth/pages/profile";
import EditProfile from "./modules/auth/pages/profile/edit";
import ChangePassword from "./modules/auth/pages/profile/change-password";
import RolesPermissionsEdit from "./modules/auth/pages/roles-permissions/edit";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: <MainDashboardLayout />,
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
            element: <Users />,
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
            element: <UserCreate />,
          },
          {
            path: "/dashboard/users/edit/:id",
            element: <UserEdit />,
          },
          {
            path: "/dashboard/roles-permissions",
            element: <RolesPermissions />,
          },
          {
            path: "/dashboard/roles-permissions/create",
            element: <RolesPermissionsCreate />,
          },
          {
            path: "/dashboard/roles-permissions/edit/:id",
            element: <RolesPermissionsEdit />,
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
