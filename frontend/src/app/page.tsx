'use client';

import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  message,
  ConfigProvider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useLogin, useRegister } from '../hooks/useAuth';

const { Title, Text } = Typography;

interface AuthForm {
  email: string;
  password: string;
  name?: string;
}

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const onFinish = async (values: AuthForm) => {
    if (isLogin) {
      loginMutation.mutate({
        email: values.email,
        password: values.password,
      });
    } else {
      registerMutation.mutate({
        email: values.email,
        password: values.password,
        name: values.name!,
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    form.resetFields();
  };

  const loading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Title level={1} className="!text-4xl !font-bold !text-gray-900 !mb-2">
            欢迎使用
          </Title>
          <Text className="text-gray-600 text-lg">
            {isLogin ? '登录您的账户' : '创建新账户'}
          </Text>
        </div>

        <Card className="shadow-xl">
          <Form
            form={form}
            name="auth-form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            {!isLogin && (
              <Form.Item
                name="name"
                label="姓名"
                rules={[
                  { required: !isLogin, message: '请输入姓名' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入您的姓名"
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="请输入您的邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 3, message: '密码至少3位' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入您的密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={isLogin ? <LoginOutlined /> : <UserAddOutlined />}
                className="w-full h-12 text-base"
              >
                {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">或者</Text>
          </Divider>

          <div className="text-center">
            <Button type="link" onClick={toggleMode} className="text-base">
              {isLogin ? '没有账户？立即注册' : '已有账户？立即登录'}
            </Button>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary">
            全栈项目 - Next.js + NestJS + MongoDB + Ant Design + TanStack Query
          </Text>
        </div>
      </div>
    </div>
  );
}