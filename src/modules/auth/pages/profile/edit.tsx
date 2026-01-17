import { useEffect, useState } from "react";
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
  Spin,
  Space,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useProfile } from "../../hooks/use-auth";
import { useUpdateUser } from "../../hooks/use-user";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data, isLoading, refetch } = useProfile();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );

  const user = data?.data;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
      if (user.profileImageUrl) {
        setPreviewImage(user.profileImageUrl);
      }
    }
  }, [user, form]);

  const onFinish = (values: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("profileImage", fileList[0].originFileObj);
    }

    updateUser(
      { id: user.id, data: formData },
      {
        onSuccess: () => {
          message.success("Profile updated successfully");
          refetch();
        },
        onError: (error) => {
          message.error(error.message || "Failed to update profile");
        },
      }
    );
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
      setPreviewImage(user?.profileImageUrl);
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
      // Create a preview URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setPreviewImage(reader.result as string);
      return false; // Prevent auto upload
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-100">
        <Spin />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard/profile")}
          />
          <span>Edit Profile</span>
        </div>
      }
      style={{ border: "none" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isUpdating}
        initialValues={{
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        }}
      >
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
                { required: true, message: "Please enter your full name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Enter your phone number" />
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
                <Button onClick={() => navigate("/dashboard/profile")}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
