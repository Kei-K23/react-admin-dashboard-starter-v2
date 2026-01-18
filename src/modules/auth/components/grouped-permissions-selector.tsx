import { Checkbox, Row, Col, Typography } from "antd";
import type { PermissionClass } from "../services/role-and-permissions.service";

const { Text } = Typography;

export interface GroupedPermissionsSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  groupedPermissions: Record<string, PermissionClass[]>;
}

export const GroupedPermissionsSelector = ({
  value = [],
  onChange,
  groupedPermissions,
}: GroupedPermissionsSelectorProps) => {
  const handleSelectAllModule = (module: string, checked: boolean) => {
    const modulePermissionIds = groupedPermissions[module].map((p) => p.id);
    const currentIds = value;

    let newIds: string[];
    if (checked) {
      // Add all module permissions that aren't already selected
      newIds = [...new Set([...currentIds, ...modulePermissionIds])];
    } else {
      // Remove all module permissions
      newIds = currentIds.filter((id) => !modulePermissionIds.includes(id));
    }

    onChange?.(newIds);
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    const currentIds = value;
    let newIds: string[];
    if (checked) {
      newIds = [...currentIds, id];
    } else {
      newIds = currentIds.filter((pid) => pid !== id);
    }
    onChange?.(newIds);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
        const modulePermissionIds = modulePermissions.map((p) => p.id);
        const selectedCount = modulePermissionIds.filter((id) =>
          value.includes(id),
        ).length;
        const isAllSelected =
          modulePermissions.length > 0 &&
          selectedCount === modulePermissions.length;
        const isIndeterminate =
          selectedCount > 0 && selectedCount < modulePermissions.length;

        return (
          <div
            key={module}
            className="bg-white p-4 rounded border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-b-gray-200">
              <Text strong className="capitalize text-lg">
                {module.replace(/_/g, " ")}
              </Text>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(e) =>
                  handleSelectAllModule(module, e.target.checked)
                }
              >
                Select All
              </Checkbox>
            </div>
            <Row gutter={[16, 16]}>
              {modulePermissions.map((permission) => (
                <Col span={6} key={permission.id}>
                  <Checkbox
                    checked={value.includes(permission.id)}
                    onChange={(e) =>
                      handlePermissionChange(permission.id, e.target.checked)
                    }
                  >
                    {permission.permission.replace(/_/g, " ")}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
    </div>
  );
};
