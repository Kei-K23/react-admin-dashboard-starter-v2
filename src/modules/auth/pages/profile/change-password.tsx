import { Form, Input, Button, Card, message, Typography, Space } from "antd";
import {
  LockOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useChangePassword, useLogout } from "../../hooks/use-auth";

const { Title, Text } = Typography;

export default function ChangePassword() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [form] = Form.useForm();
  const { mutate: changePassword, isPending } = useChangePassword();

  const onFinish = (values: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    if (values.newPassword !== values.confirmNewPassword) {
      form.setFields([
        {
          name: "confirmNewPassword",
          errors: ["Passwords do not match"],
        },
      ]);
      return;
    }

    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          message.success("Password changed successfully! Please login again.");
          form.resetFields();
          logout();
        },
        onError: (error) => {
          message.error(
            error.response.data.message || "Failed to change password",
          );
        },
      },
    );
  };

  return (
    <div className="w-full mx-auto">
      <Card
        style={{ border: 0 }}
        styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
        title={
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard/profile")}
            />
            <span>Change Password</span>
          </div>
        }
      >
        <div className="mb-6">
          <Title level={4} className="!mb-0">
            Create new password
          </Title>
          <Text type="secondary">
            Your new password must be different from previous used passwords.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter current password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The new passwords that you entered do not match!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isPending}
              >
                Change Password
              </Button>
              <Button onClick={() => navigate("/dashboard/profile")}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
