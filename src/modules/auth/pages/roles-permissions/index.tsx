import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useGetAllRoles,
  useDeleteRole,
  hasPermission,
} from "../../hooks/use-role-and-permissions";
import type { ColumnsType } from "antd/es/table";
import type { Role } from "../../services/role-and-permissions.service";
import { formatDate } from "../../../../lib/date-utils";
import {
  PERMISSION_ENUM,
  PERMISSION_MODULES,
} from "../../../../common/constraints";
import { useProfile } from "../../hooks/use-auth";

export default function RolesPermissions() {
  const { data: profileData } = useProfile();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const rolesParams = {
    page: page.toString(),
    limit: limit.toString(),
  } as Record<string, string | number | boolean>;

  const useRolesQuery = useGetAllRoles(rolesParams);
  const { data: rolesData, isLoading, refetch } = useRolesQuery(rolesParams);

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const handleDelete = (id: string) => {
    deleteRole(id, {
      onSuccess: ({ data }) => {
        message.success(data.message || "Role deleted successfully");
        refetch();
      },
      onError: (error) => {
        message.error(error.response.data.message || "Failed to delete role");
      },
    });
  };

  const columns: ColumnsType<Role> = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <SafetyCertificateOutlined className="text-blue-500" />
          <span className="font-medium">{name}</span>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) =>
        desc || <span className="text-gray-400">No description</span>,
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_, record) => {
        const count = record.rolePermissions?.length || 0;
        return (
          <Tag color={count > 0 ? "blue" : "default"}>
            {count} Permission{count !== 1 ? "s" : ""}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {hasPermission(
            profileData?.data,
            PERMISSION_MODULES.ROLES,
            PERMISSION_ENUM.Update,
          ) && (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(`/dashboard/roles-permissions/edit/${record.id}`)
                }
              />
            </Tooltip>
          )}

          {hasPermission(
            profileData?.data,
            PERMISSION_MODULES.ROLES,
            PERMISSION_ENUM.Delete,
          ) && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete Role"
                description="Are you sure you want to delete this role? This might affect users assigned to this role."
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true, loading: isDeleting }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{ border: "none" }}
      styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
      title="Roles & Permissions"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            Refresh
          </Button>
          {hasPermission(
            profileData?.data,
            PERMISSION_MODULES.ROLES,
            PERMISSION_ENUM.Create,
          ) && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/dashboard/roles-permissions/create")}
            >
              Create Role
            </Button>
          )}
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={rolesData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: rolesData?.meta?.total || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} roles`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
