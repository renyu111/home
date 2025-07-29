'use client';

import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography,
  Space,
  Button,
  Form,
  Input,
  Switch,
  Select,
  Divider,
  message,
  Alert,
  Descriptions,
  Tag
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  SecurityOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import AuthGuard from '../../components/AuthGuard';
import AppLayout from '../../components/AppLayout';

const { Title, Text } = Typography;
const { Option } = Select;

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileSize: number;
  sessionTimeout: number;
  emailNotifications: boolean;
  theme: string;
  language: string;
}

function SettingsContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟系统设置数据
  const defaultSettings: SystemSettings = {
    siteName: '全栈管理系统',
    siteDescription: '基于Next.js + NestJS + MongoDB的现代化管理系统',
    maintenanceMode: false,
    allowRegistration: true,
    maxFileSize: 10,
    sessionTimeout: 30,
    emailNotifications: true,
    theme: 'light',
    language: 'zh-CN'
  };

  const handleSave = async (values: SystemSettings) => {
    setLoading(true);
    try {
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('设置保存成功！');
      console.log('保存的设置:', values);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
    message.info('设置已重置为默认值');
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>系统设置</Title>
        <Text type="secondary">管理系统配置和参数</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={defaultSettings}
        onFinish={handleSave}
      >
        <Row gutter={[24, 24]}>
          {/* 基本设置 */}
          <Col span={12}>
            <Card title="基本设置" icon={<SettingOutlined />}>
              <Form.Item
                name="siteName"
                label="网站名称"
                rules={[{ required: true, message: '请输入网站名称' }]}
              >
                <Input placeholder="请输入网站名称" />
              </Form.Item>
              
              <Form.Item
                name="siteDescription"
                label="网站描述"
                rules={[{ required: true, message: '请输入网站描述' }]}
              >
                <Input.TextArea rows={3} placeholder="请输入网站描述" />
              </Form.Item>

              <Form.Item
                name="theme"
                label="主题设置"
              >
                <Select>
                  <Option value="light">浅色主题</Option>
                  <Option value="dark">深色主题</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="language"
                label="语言设置"
              >
                <Select>
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 安全设置 */}
          <Col span={12}>
            <Card title="安全设置" icon={<SecurityOutlined />}>
              <Form.Item
                name="maintenanceMode"
                label="维护模式"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowRegistration"
                label="允许注册"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="会话超时时间（分钟）"
              >
                <Select>
                  <Option value={15}>15分钟</Option>
                  <Option value={30}>30分钟</Option>
                  <Option value={60}>1小时</Option>
                  <Option value={120}>2小时</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maxFileSize"
                label="最大文件上传大小（MB）"
              >
                <Select>
                  <Option value={5}>5MB</Option>
                  <Option value={10}>10MB</Option>
                  <Option value={20}>20MB</Option>
                  <Option value={50}>50MB</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 通知设置 */}
          <Col span={12}>
            <Card title="通知设置" icon={<BellOutlined />}>
              <Form.Item
                name="emailNotifications"
                label="邮件通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Alert
                message="通知设置说明"
                description="开启邮件通知后，系统会向用户发送重要事件的通知邮件。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </Card>
          </Col>

          {/* 系统信息 */}
          <Col span={12}>
            <Card title="系统信息" icon={<DatabaseOutlined />}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Node.js版本">18.17.0</Descriptions.Item>
                <Descriptions.Item label="数据库">MongoDB 6.0</Descriptions.Item>
                <Descriptions.Item label="前端框架">Next.js 14</Descriptions.Item>
                <Descriptions.Item label="后端框架">NestJS</Descriptions.Item>
                <Descriptions.Item label="UI组件库">Ant Design</Descriptions.Item>
                <Descriptions.Item label="状态管理">TanStack Query</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 操作按钮 */}
        <Row justify="center">
          <Space size="large">
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              htmlType="submit"
              loading={loading}
              size="large"
            >
              保存设置
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              size="large"
            >
              重置设置
            </Button>
          </Space>
        </Row>
      </Form>
    </AppLayout>
  );
}

export default function Settings() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}