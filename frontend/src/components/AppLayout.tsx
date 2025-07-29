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
  PictureOutlined
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
    switch (key) {
      case 'gallery':
        if (pathname !== '/gallery') {
          router.push('/gallery');
        }
        break;
      case 'settings':
        if (pathname !== '/settings') {
          router.push('/settings');
        }
        break;
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    if (pathname === '/gallery') return 'gallery';
    if (pathname === '/settings') return 'settings';
    return 'gallery'; // 默认选中图片鉴赏
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
          items={[
            {
              key: 'gallery',
              icon: <PictureOutlined />,
              label: '图片鉴赏',
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: '系统设置',
            },
          ]}
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
              <Dropdown overlay={userMenu} placement="bottomRight">
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