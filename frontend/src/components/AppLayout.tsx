'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Space,
  Dropdown,
  Typography
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined,
  PictureOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useLogout } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleMenuClick = (key: string) => {
    if (pathname !== key) {
      router.push(key);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "/gallery",
      icon: <PictureOutlined />,
      label: "图片鉴赏",
    },
    {
      key: "/bookmarks",
      icon: <BookOutlined />,
      label: "收藏夹",
    },
    {
      key: "/files",
      icon: <FileTextOutlined />,
      label: "本地文档",
    },
    {
      key: "/docs",
      icon: <FileTextOutlined />,
      label: "文档",
    },
  ];

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    return pathname;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Space>
              <Button type="text" icon={<BellOutlined />} />
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="text" icon={<UserOutlined />}>
                  {user?.name || '用户'}
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}