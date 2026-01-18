import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  App,
  Spin,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import {
  useGetRoleById,
  useUpdateRole,
  useGetAllPermissions,
} from "../../hooks/use-role-and-permissions";
import { useMemo, useEffect } from "react";
import type { PermissionClass } from "../../services/role-and-permissions.service";
import { GroupedPermissionsSelector } from "../../components/grouped-permissions-selector";

const { TextArea } = Input;

export default function RolesPermissionsEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // Hooks
  const useRole = useGetRoleById(id || "");
  const { data: roleData, isLoading: isLoadingRole } = useRole({ id: id || "" });
  
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetAllPermissions();

  const permissions = permissionsData?.data || [];
  const role = roleData?.data;

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, PermissionClass[]> = {};
    permissions.forEach((p) => {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(p);
    });
    return grouped;
  }, [permissions]);

  // Set initial values when role data is loaded
  useEffect(() => {
    if (role) {
      const currentPermissionIds = role.rolePermissions.map(rp => rp.permissionId);
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissionIds: currentPermissionIds,
      });
    }
  }, [role, form]);

  const onFinish = (values: {
    name: string;
    description: string;
    permissionIds: string[];
  }) => {
    if (!id) return;
    
    updateRole(
      {
        id,
        name: values.name,
        description: values.description,
        permissionIds: values.permissionIds || [],
      },
      {
        onSuccess: () => {
          message.success("Role updated successfully");
          navigate("/dashboard/roles-permissions");
        },
        onError: (error) => {
          message.error(error.message || "Failed to update role");
        },
      },
    );
  };

  const isLoading = isLoadingRole || isLoadingPermissions;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      style={{ border: "none" }}
      styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
      title={
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard/roles-permissions")}
          />
          <span>Edit Role</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col xs={24} lg={10}>
            <Form.Item
              name="name"
              label="Role Name"
              rules={[
                { required: true, message: "Please enter role name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="e.g. Content Editor" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea
                rows={4}
                placeholder="Describe the responsibilities of this role..."
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isUpdating}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => navigate("/dashboard/roles-permissions")}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Col>

          <Col xs={24} lg={14}>
            <Card type="inner" title="Permissions">
              <Form.Item
                name="permissionIds"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one permission",
                  },
                ]}
              >
                <GroupedPermissionsSelector
                  groupedPermissions={groupedPermissions}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
