"use client";

import AppLayout from '../components/AppLayout';
import { Typography, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <AppLayout>
      <Card>
        <Title level={2}>欢迎</Title>
        <Paragraph>本应用已移除登录/注册功能，直接使用所有页面。</Paragraph>
        <Text type="secondary">可从侧边栏进入各功能。</Text>
      </Card>
    </AppLayout>
  );
}