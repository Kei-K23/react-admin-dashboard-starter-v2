import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Space, type MenuProps } from "antd";
import { Link } from "react-router";
import { useProfile } from "../hooks/use-auth";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to="/dashboard/profile">Profile</Link>,
  },
  {
    key: "3",
    icon: <LogoutOutlined />,
    danger: true,
    label: <Link to="/dashboard/logout">Logout</Link>,
  },
];

export default function UserAvatar() {
  const { data } = useProfile();
  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar
            size="large"
            src={data?.data?.profileImageUrl || ""}
            icon={<UserOutlined />}
            className="border-4 border-gray-100"
          />
        </Space>
      </a>
    </Dropdown>
  );
}
