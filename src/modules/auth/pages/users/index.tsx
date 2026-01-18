import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Tooltip,
  Popconfirm,
  App,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetAllUsers, useDeleteUser } from "../../hooks/use-user";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";
import type { ColumnsType } from "antd/es/table";
import type { UserWithRole } from "../../services/user.service";
import { formatDate } from "../../../../lib/date-utils";
import { useDebounce } from "../../../../hooks/use-debounce.ts";

export default function Users() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [isBanned, setIsBanned] = useState<"true" | "false" | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const usersParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(roleId ? { roleId } : {}),
    ...(isBanned ? { isBanned } : {}),
  } as Record<string, string | number | boolean>;

  const useUsersQuery = useGetAllUsers(usersParams);
  const { data: usersData, isLoading, refetch } = useUsersQuery(usersParams);

  const rolesParams = { getAll: "true" };
  const useRoles = useGetAllRoles(rolesParams);
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(rolesParams);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        message.success("User deleted successfully");
        refetch();
      },
      onError: (error) => {
        message.error(error.message || "Failed to delete user");
      },
    });
  };

  const columns: ColumnsType<UserWithRole> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.profileImageUrl} icon={<UserOutlined />} />
          <div className="flex flex-col">
            <span className="font-medium">{record.fullName}</span>
            <span className="text-xs text-gray-500">{record.email}</span>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "role",
      render: (roleName) => <Tag color="blue">{roleName}</Tag>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isBanned ? "error" : "success"}>
          {record.isBanned ? "Banned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/dashboard/users/edit/${record.id}`)} // Note: This route needs to be created
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Users Management"
      style={{ border: "none" }}
      styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("create")}
          >
            Create User
          </Button>
        </Space>
      }
    >
      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
          allowClear
        />
        <Select
          placeholder="Filter by Role"
          allowClear
          className="w-full sm:w-48"
          loading={isLoadingRoles}
          onChange={(value) => setRoleId(value)}
          options={rolesData?.data?.map((role) => ({
            label: role.name,
            value: role.id,
          }))}
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          className="w-full sm:w-48"
          onChange={(value) => setIsBanned(value)}
          options={[
            { label: "Active", value: "false" },
            { label: "Banned", value: "true" },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={usersData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: usersData?.meta?.total || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
