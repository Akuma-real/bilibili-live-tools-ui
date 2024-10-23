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
      const payload = {
        ...values,
        monitor_mids: JSON.stringify(values.monitor_mids)
      };
      return request.post('/config/update', payload);
    },
    onSuccess: () => {
      message.success('配置已更新');
    }
  });

  // 将 onSuccess 逻辑移到这里
  React.useEffect(() => {
    if (configData) {
      form.setFieldsValue({
        monitor_mids: configData.monitor_mids.replace(/[\[\]"]/g, '').split(','),
        check_interval: parseInt(configData.check_interval),
        bilibili_cookies: configData.bilibili_cookies,
        server_chan_key: configData.server_chan_key
      });
    }
  }, [configData, form]);

  return (
    <Card title="系统配置">
      <Form
        form={form}
        layout="vertical"
        onFinish={values => updateConfig.mutate(values)}
      >
        <Form.Item
          label="监控 UID 列表（用逗号分隔）"
          name="monitor_mids"
          rules={[{ required: true, message: '请输入要监控的主播 UID' }]}
        >
          <TextArea 
            placeholder="例如：114514,1919810" 
            autoSize={{ minRows: 2 }}
          />
        </Form.Item>

        <Form.Item
          label="检查间隔（秒）"
          name="check_interval"
          rules={[{ required: true, message: '请输入检查间隔' }]}
        >
          <InputNumber min={30} max={3600} style={{ width: 200 }} />
        </Form.Item>

        <Form.Item
          label="B站 Cookies"
          name="bilibili_cookies"
        >
          <TextArea 
            placeholder="可选：用于获取更详细的信息" 
            autoSize={{ minRows: 3 }}
          />
        </Form.Item>

        <Form.Item
          label="Server酱 Key"
          name="server_chan_key"
        >
          <Input placeholder="可选：用于推送通知" />
        </Form.Item>

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
