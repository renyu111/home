'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, Space } from 'antd';

const { Text, Title } = Typography;

export default function TokenInfo() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    setToken(storedToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Card title="Token 信息" style={{ margin: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Token:</Title>
          <Text code style={{ wordBreak: 'break-all' }}>
            {token ? token.substring(0, 50) + '...' : '未登录'}
          </Text>
        </div>
        
        <div>
          <Title level={5}>用户信息:</Title>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {user ? JSON.stringify(user, null, 2) : '未登录'}
          </pre>
        </div>
        
        <Button onClick={clearToken} danger>
          清除Token
        </Button>
      </Space>
    </Card>
  );
}