import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  message,
  Avatar,
  Row,
  Col,
  Space,
  Select,
  Switch,
  Spin,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useGetUserById, useUpdateUser } from "../../hooks/use-user";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";

export default function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const rolesParams = { getAll: "true" };
  const useRoles = useGetAllRoles(rolesParams);
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(rolesParams);

  const { data: userData, isLoading: isLoadingUser } = useGetUserById(id || "")(
    { id: id || "" },
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        isBanned: user.isBanned,
      });
      if (user.profileImageUrl) {
        setPreviewImage(user.profileImageUrl);
      }
    }
  }, [userData, form]);

  const onFinish = (values: {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    isBanned: boolean;
    password?: string;
  }) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("roleId", values.roleId);
    formData.append("isBanned", String(values.isBanned));

    if (values.password) {
      formData.append("password", values.password);
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("profileImage", fileList[0].originFileObj);
    }

    updateUser(
      { id, data: formData },
      {
        onSuccess: () => {
          message.success("User updated successfully");
          navigate("/dashboard/users");
        },
        onError: (error) => {
          message.error(error.message || "Failed to update user");
        },
      },
    );
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
      setPreviewImage(undefined);
    },
    beforeUpload: (file) => {
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          originFileObj: file,
        },
      ]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setPreviewImage(reader.result as string);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Card
        style={{ border: "none" }}
        styles={{ header: { padding: "20px 0" }, body: { padding: "20px 0" } }}
        title={
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard/users")}
            />
            <span>Edit User</span>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <div className="flex flex-col gap-y-2 justify-center items-center">
                <Avatar
                  size={140}
                  src={previewImage}
                  icon={<UserOutlined />}
                  className="border-4 border-gray-100"
                />
                <Upload {...uploadProps} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Change Avatar</Button>
                </Upload>
                <div className="text-gray-500 text-xs text-center">
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br />
                  Max size of 3 MB
                </div>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter full name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                extra="Leave blank to keep current password"
                rules={[
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select
                  placeholder="Select a role"
                  loading={isLoadingRoles}
                  options={rolesData?.data?.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                />
              </Form.Item>

              <Form.Item name="isBanned" label="Status" valuePropName="checked">
                <Switch
                  checkedChildren="Banned"
                  unCheckedChildren="Active"
                  className="bg-gray-300"
                />
              </Form.Item>

              <Form.Item className="mt-8">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isUpdating}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => navigate("/dashboard/users")}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
