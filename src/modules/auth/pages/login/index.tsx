import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Typography,
  App,
} from "antd";
import { useLogin, useProfile } from "../../hooks/use-auth";
import ms, { type StringValue } from "ms";
import Cookies from "js-cookie";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../../../../common/constraints";
import { Link, useNavigate } from "react-router";
const { Text, Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const { mutate: login, isPending } = useLogin();
  const { refetch } = useProfile();

  const onFinish = (values: { email: string; password: string }) => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: ({ data }) => {
          const accessExpires = new Date(
            Date.now() + ms(data?.data?.accessTokenExpiresAt as StringValue),
          );
          const refreshExpires = new Date(
            Date.now() + ms(data?.data?.refreshTokenExpiresAt as StringValue),
          );

          Cookies.set(ACCESS_TOKEN_KEY, data?.data?.accessToken, {
            path: "/",
            sameSite: "lax",
            secure: window.location.protocol === "https:",
            expires: accessExpires,
          });

          Cookies.set(REFRESH_TOKEN_KEY, data?.data?.refreshToken, {
            path: "/",
            sameSite: "lax",
            secure: window.location.protocol === "https:",
            expires: refreshExpires,
          });

          messageApi.open({
            type: "success",
            content: data.message,
          });

          refetch();
          navigate("/dashboard");
        },
        onError: ({ response }) => {
          messageApi.open({
            type: "error",
            content: response.data.message,
          });
        },
      },
    );
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
          <div className="w-100">
            <Title level={4}>Login to your account</Title>
            <Text>Enter your email below to login to your account</Text>
            <Form
              name="login"
              initialValues={{ remember: true }}
              style={{ width: "100%", marginTop: 20 }}
              onFinish={onFinish}
              layout="vertical"
              disabled={isPending}
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
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password">Forgot password</Link>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
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
