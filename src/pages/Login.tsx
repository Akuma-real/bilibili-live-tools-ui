import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import request from '../utils/request';
import { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const verifyApiKey = useMutation({
    mutationFn: async (values: { apiKey: string }) => {
      // 验证 API Key
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders({
          'X-API-Key': values.apiKey
        })
      };
      const response = await request.get('/config/', config);
      // 如果请求成功，说明 API Key 有效
      localStorage.setItem('apiKey', values.apiKey);
      return response;
    },
    onSuccess: () => {
      message.success('登录成功');
      navigate('/dashboard');
    }
  });

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5' 
    }}>
      <Card title="BLV 监控系统" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={verifyApiKey.mutate}
        >
          <Form.Item
            name="apiKey"
            rules={[{ required: true, message: '请输入 API Key' }]}
          >
            <Input.Password 
              placeholder="请输入 API Key" 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={verifyApiKey.isPending}
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
