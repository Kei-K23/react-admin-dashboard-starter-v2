import { useState } from "react";
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
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useCreateUser } from "../../hooks/use-user";
import { useGetAllRoles } from "../../hooks/use-role-and-permissions";

export default function UserCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const rolesParams = { limit: "100" };
  const useRoles = useGetAllRoles(rolesParams);
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(rolesParams);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );

  const onFinish = (values: {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    password?: string;
  }) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("roleId", values.roleId);
    if (values.password) {
      formData.append("password", values.password);
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("profileImage", fileList[0].originFileObj);
    }

    createUser(formData, {
      onSuccess: () => {
        message.success("User created successfully");
        navigate("/dashboard/users");
      },
      onError: (error) => {
        message.error(error.message || "Failed to create user");
      },
    });
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        title={
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard/users")}
            />
            <span>Create New User</span>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col
              xs={24}
              md={8}
              className="flex flex-col items-center gap-4 mb-6"
            >
              <Avatar
                size={120}
                src={previewImage}
                icon={<UserOutlined />}
                className="border-4 border-gray-100"
              />
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
              <div className="text-gray-500 text-xs text-center">
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br />
                Max size of 3 MB
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
                <Input placeholder="Enter full name" size="large" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter password" size="large" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" size="large" />
              </Form.Item>

              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select
                  placeholder="Select a role"
                  size="large"
                  loading={isLoadingRoles}
                  options={rolesData?.data?.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                />
              </Form.Item>

              <Form.Item className="mt-8">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isCreating}
                    size="large"
                  >
                    Create User
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/dashboard/users")}
                  >
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
