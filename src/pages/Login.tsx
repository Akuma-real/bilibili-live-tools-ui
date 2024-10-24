import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import request from '../utils/request';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { apiKey: string }) => {
    setLoading(true);
    try {
      // 使用 /config/ 端点验证 API Key
      await request.get('/config/', {
        headers: {
          'X-API-Key': values.apiKey
        } as any
      });
      login(values.apiKey);
      message.success('登录成功');
    } catch (error: any) {
      if (error?.detail === 'Not authenticated') {
        message.error('API Key 无效');
      } else {
        message.error('验证失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card title="登录" style={{ width: 300 }}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: '请输入 API Key' }]}
          >
            <Input.Password placeholder="请输入 API Key" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
