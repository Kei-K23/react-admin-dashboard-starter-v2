import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  Tag,
  Typography,
  Tabs,
  Space,
  Flex,
  Button,
  Popconfirm,
  App,
} from "antd";
import type { PopconfirmProps, TabsProps } from "antd";
import { useLogout, useProfile } from "../../hooks/use-auth";
import { formatDate, formatDateTime } from "../../../../lib/date-utils";

import { useNavigate } from "react-router";
import { useDeleteUser } from "../../hooks/use-user";

const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();
  const { data, isLoading } = useProfile();
  const { message } = App.useApp();
  const { mutate: deleteUser } = useDeleteUser();
  const logout = useLogout();

  const confirmDelete: PopconfirmProps["onConfirm"] = () => {
    if (!data?.data.id) {
      message.error("User ID not found");
      return;
    }
    deleteUser(data?.data.id);
    message.success("Account deleted successfully");
    logout();
  };

  const cancelDelete: PopconfirmProps["onCancel"] = () => {
    message.info("Cancel Account Delete");
  };

  // Cast data to UserWithRole since the hook return type might be generic
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Overview",
      children: (
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Full Name">
            {user.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined /> {user.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <Space>
              <PhoneOutlined /> {user.phone || "N/A"}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color="blue">{user.role?.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={user.isBanned ? "error" : "success"}>
              {user.isBanned ? "Banned" : "Active"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            <Space>
              <CalendarOutlined />
              {formatDate(user.createdAt)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            <Space>
              <FieldTimeOutlined />
              {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "2",
      label: "Security",
      children: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Two-Factor Authentication">
            <Tag color={user.twoFactorEnabled ? "success" : "warning"}>
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} lg={6}>
          <Card className="text-center h-full">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar
                size={140}
                src={user.profileImageUrl}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <div className="mt-4">
                <Title level={4} style={{ margin: 0 }}>
                  {user.fullName}
                </Title>
                <Text type="secondary" style={{ display: "block" }}>
                  {user.email}
                </Text>
                <Text type="secondary">{user.role?.name}</Text>
              </div>
              <Flex justify="center" gap={10}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate("edit")}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete the account"
                  description="Are you sure to delete the account? This process cannot be undone."
                  onConfirm={confirmDelete}
                  onCancel={cancelDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Flex>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16} lg={18}>
          <Card className="h-full">
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
