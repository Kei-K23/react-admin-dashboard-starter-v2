import { useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Typography,
  App,
  Steps,
} from "antd";
import { LockOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import {
  useForgotPasswordRequest,
  useForgotPasswordVerify,
  useResetPassword,
} from "../../hooks/use-auth";

const { Title, Text } = Typography;

const Step = {
  REQUEST: 0,
  VERIFY: 1,
  RESET: 2,
} as const;

type Step = (typeof Step)[keyof typeof Step];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const [currentStep, setCurrentStep] = useState<Step>(Step.REQUEST);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { mutate: requestOtp, isPending: isRequesting } =
    useForgotPasswordRequest();
  const { mutate: verifyOtp, isPending: isVerifying } =
    useForgotPasswordVerify();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const onRequestFinish = (values: { email: string }) => {
    requestOtp(
      { email: values.email },
      {
        onSuccess: (response) => {
          setEmail(values.email);
          setUserId(response.data.data.userId);
          setCurrentStep(Step.VERIFY);
          messageApi.success("OTP sent to your email!");
        },
        onError: (error) => {
          messageApi.error(
            error.response?.data?.message || "Failed to send OTP",
          );
        },
      },
    );
  };

  const onVerifyFinish = (values: { otp: string }) => {
    verifyOtp(
      { userId, code: values.otp },
      {
        onSuccess: (response) => {
          setAccessToken(response.data.data.accessToken);
          setCurrentStep(Step.RESET);
          messageApi.success("OTP verified successfully!");
        },
        onError: (error) => {
          messageApi.error(error.response?.data?.message || "Invalid OTP");
        },
      },
    );
  };

  const onResetFinish = (values: { password: string }) => {
    resetPassword(
      { accessToken, newPassword: values.password },
      {
        onSuccess: () => {
          messageApi.success("Password reset successfully! Please login.");
          navigate("/login");
        },
        onError: (error) => {
          messageApi.error(
            error.response?.data?.message || "Failed to reset password",
          );
        },
      },
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.REQUEST:
        return (
          <Form
            name="forgot-password-request"
            onFinish={onRequestFinish}
            layout="vertical"
            disabled={isRequesting}
            style={{ width: "100%", marginTop: 20 }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please input a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isRequesting}
              >
                Send OTP
              </Button>
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        );
      case Step.VERIFY:
        return (
          <Form
            name="forgot-password-verify"
            onFinish={onVerifyFinish}
            layout="vertical"
            disabled={isVerifying}
            style={{ width: "100%", marginTop: 20 }}
          >
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Text type="secondary">
                We sent a code to {email}. Please enter it below.
              </Text>
            </div>
            <Form.Item
              name="otp"
              label="OTP Code"
              rules={[
                { required: true, message: "Please input the OTP code!" },
              ]}
            >
              <Input prefix={<NumberOutlined />} placeholder="OTP Code" />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isVerifying}
              >
                Verify OTP
              </Button>
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button type="link" onClick={() => setCurrentStep(Step.REQUEST)}>
                Resend OTP / Change Email
              </Button>
            </div>
          </Form>
        );
      case Step.RESET:
        return (
          <Form
            name="forgot-password-reset"
            onFinish={onResetFinish}
            layout="vertical"
            disabled={isResetting}
            style={{ width: "100%", marginTop: 20 }}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isResetting}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );
    }
  };

  return (
    <Row style={{ height: "100vh" }}>
      <Col span={12} style={{ height: "100%" }}>
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ height: "100%" }}
        >
          <div
            className="w-100"
            style={{ maxWidth: 400, width: "100%", padding: 20 }}
          >
            <Title level={4} style={{ textAlign: "center", marginBottom: 30 }}>
              {currentStep === Step.REQUEST && "Forgot Password"}
              {currentStep === Step.VERIFY && "Verify OTP"}
              {currentStep === Step.RESET && "Reset Password"}
            </Title>

            <Steps
              current={currentStep}
              items={[
                { title: "Request" },
                { title: "Verify" },
                { title: "Reset" },
              ]}
              style={{ marginBottom: 30 }}
            />

            {renderStepContent()}
          </div>
        </Flex>
      </Col>
      <Col span={12} style={{ height: "100%" }}>
        <img
          src="/login_img.jpeg"
          alt="login_img"
          className="w-full h-full object-cover"
        />
      </Col>
    </Row>
  );
}
