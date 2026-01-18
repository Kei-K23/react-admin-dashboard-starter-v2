import React, { useState, useEffect, useMemo } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Drawer,
  Grid,
  Flex,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { navigationConfig, type NavigationItem } from "../config/navigation";
import UserAvatar from "../modules/auth/components/user-avatar";
import { useProfile } from "../modules/auth/hooks/use-auth";
import { hasPermission } from "../modules/auth/hooks/use-role-and-permissions";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>["items"][number];

export default function MainDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: profileData } = useProfile();
  const user = profileData?.data;

  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line
    setMobileDrawerOpen(false);
  }, [location]);

  const menuItems = useMemo(() => {
    const mapItems = (items: NavigationItem[]): MenuItem[] => {
      return items
        .filter((item) => {
          if (item.permission) {
            return hasPermission(
              user,
              item.permission.module,
              item.permission.type,
            );
          }
          return true;
        })
        .map((item) => {
          const children = item.children ? mapItems(item.children) : undefined;

          // If item has children definition but all filtered out, return null (hide parent)
          // unless it's a leaf node that just happened to not have children in the first place?
          // Actually if item.children exists but is empty array after filtering, we might want to hide it
          // if it acts as a group folder.
          if (item.children && (!children || children.length === 0)) {
            return null;
          }

          return {
            key: item.path || item.key,
            icon: item.icon,
            label: item.title,
            children: children,
          };
        })
        .filter((item) => item !== null) as MenuItem[];
    };
    return mapItems(navigationConfig);
  }, [user]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  const breadcrumbItems = useMemo(() => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    // Helper to find title in config
    const findTitle = (
      path: string,
      items: NavigationItem[],
    ): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.title;
        if (item.children) {
          const found = findTitle(path, item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const title =
        findTitle(url, navigationConfig) ||
        pathSnippets[index].charAt(0).toUpperCase() +
          pathSnippets[index].slice(1);

      const isLast = index === pathSnippets.length - 1;

      return {
        title: isLast ? title : <Link to={url}>{title}</Link>,
      };
    });
  }, [location.pathname]);

  const MenuContent = (
    <>
      <div className="h-16 w-full flex items-center justify-center">
        <DashboardOutlined
          style={{ marginRight: collapsed && !isMobile ? 0 : 8 }}
        />
        {(!collapsed || isMobile) && "Admin Dashboard"}
      </div>
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile ? (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          style={siderStyle}
          // We handle collapse manually to sync with trigger button
        >
          {MenuContent}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          styles={{ body: { padding: 0 } }}
          size={220}
          closable={false}
        >
          {MenuContent}
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{ width: "100%", padding: "0 16px 0 0" }}
          >
            <Button
              type="text"
              icon={
                collapsed || isMobile ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerOpen(!mobileDrawerOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div>
              <UserAvatar />
            </div>
          </Flex>
        </Header>
        <Content className="mx-4">
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
            items={breadcrumbItems}
          />
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="p-5"
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          RADTv2 ©{new Date().getFullYear()} Created by Arkar Min
        </Footer>
      </Layout>
    </Layout>
  );
}

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  background: "#fff",
};
