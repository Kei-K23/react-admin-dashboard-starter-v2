import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStatus } from "../modules/auth/hooks/use-auth";

interface GuestGuardProps {
  children?: React.ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated } = useAuthStatus();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
