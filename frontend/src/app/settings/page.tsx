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
  Tag,
  InputNumber,
  Checkbox
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';
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
            <Card title="基本设置">
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
                <Select placeholder="请选择主题">
                  <Option value="light">浅色主题</Option>
                  <Option value="dark">深色主题</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="language"
                label="语言设置"
              >
                <Select placeholder="请选择语言">
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 安全设置 */}
          <Col span={12}>
            <Card title="安全设置">
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
                name="maxFileSize"
                label="最大文件大小 (MB)"
                rules={[{ required: true, message: '请输入最大文件大小' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="会话超时时间 (分钟)"
                rules={[{ required: true, message: '请输入会话超时时间' }]}
              >
                <InputNumber min={5} max={1440} style={{ width: '100%' }} />
              </Form.Item>
            </Card>
          </Col>

          {/* 通知设置 */}
          <Col span={12}>
            <Card title="通知设置">
              <Form.Item
                name="emailNotifications"
                label="邮件通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="notificationTypes"
                label="通知类型"
              >
                <Checkbox.Group options={[
                  { label: '系统消息', value: 'system' },
                  { label: '安全提醒', value: 'security' },
                  { label: '更新通知', value: 'update' },
                  { label: '活动通知', value: 'activity' }
                ]} />
              </Form.Item>
            </Card>
          </Col>

          {/* 系统信息 */}
          <Col span={12}>
            <Card title="系统信息">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Node.js版本">v18.0.0</Descriptions.Item>
                <Descriptions.Item label="数据库">MongoDB v6.0</Descriptions.Item>
                <Descriptions.Item label="前端框架">Next.js 14</Descriptions.Item>
                <Descriptions.Item label="后端框架">NestJS</Descriptions.Item>
                <Descriptions.Item label="UI组件库">Ant Design</Descriptions.Item>
                <Descriptions.Item label="运行时间">3天 12小时 45分钟</Descriptions.Item>
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
  return <SettingsContent />;
}