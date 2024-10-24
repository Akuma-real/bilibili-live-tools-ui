import React from 'react';
import { Card, Form, Input, InputNumber, Button, message, Space } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MonitorConfig, ConfigResponse } from '../types/api';
import request from '../utils/request';

const { TextArea } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm<MonitorConfig>();

  const { data: configData } = useQuery<ConfigResponse>({
    queryKey: ['config'],
    queryFn: async () => {
      const response = await request.get<ConfigResponse>('/config/');
      return response;
    }
  });

  // 更新配置
  const updateConfig = useMutation({
    mutationFn: (values: MonitorConfig) => {
      return request.post('/config/update', values);
    },
    onSuccess: () => {
      message.success('配置已更新');
    }
  });

  React.useEffect(() => {
    if (configData) {
      form.setFieldsValue({
        check_interval: parseInt(configData.check_interval),
        bilibili_cookies: configData.bilibili_cookies,
        server_chan_key: configData.server_chan_key,
        cloudflare_domain: configData.cloudflare_domain,
        cloudflare_auth_code: configData.cloudflare_auth_code
      });
    }
  }, [configData, form]);

  const configItems = [
    {
      key: 'cloudflare_domain',
      label: 'Cloudflare 域名',
      type: 'text',
    },
    {
      key: 'cloudflare_auth_code',
      label: 'Cloudflare 授权码',
      type: 'password',
    },
    {
      key: 'server_chan_key',
      label: 'Server酱 Key',
      type: 'text',
    },
    {
      key: 'bilibili_cookies',
      label: 'B站 Cookies',
      type: 'textarea',
    },
    {
      key: 'check_interval',
      label: '检查间隔(秒)',
      type: 'number',
    }
  ];

  return (
    <Card title="系统配置">
      <Form
        form={form}
        layout="vertical"
        onFinish={values => updateConfig.mutate(values)}
      >
        {configItems.map(item => (
          <Form.Item
            key={item.key}
            label={item.label}
            name={item.key}
            rules={[{ required: true, message: `请输入${item.label}` }]}
          >
            {item.type === 'text' ? <Input placeholder="请输入" /> : 
             item.type === 'password' ? <Input.Password placeholder="请输入" /> : 
             item.type === 'textarea' ? <TextArea autoSize={{ minRows: 2 }} /> : 
             <InputNumber min={30} max={3600} style={{ width: 200 }} />}
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateConfig.isPending}
            >
              保存配置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;
