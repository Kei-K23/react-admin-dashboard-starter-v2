import { Spin, Result, Button } from "antd";
import { useNavigate } from "react-router";
import { useProfile } from "../modules/auth/hooks/use-auth";
import { hasPermission } from "../modules/auth/hooks/use-role-and-permissions";
import type {
  PermissionEnum,
  PermissionModuleEnum,
} from "../common/constraints";
import React from "react";

interface PermissionsGuardProps {
  module: PermissionModuleEnum;
  permission: PermissionEnum;
  children: React.ReactNode;
}

export const PermissionsGuard = ({
  module,
  permission,
  children,
}: PermissionsGuardProps) => {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-50">
        <Spin size="large" />
      </div>
    );
  }

  if (hasPermission(user, module, permission)) {
    return <>{children}</>;
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          Back Home
        </Button>
      }
    />
  );
};
