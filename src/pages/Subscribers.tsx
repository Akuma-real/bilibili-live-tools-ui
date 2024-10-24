import React from 'react';
import { Card, Table, Button, Input, Space, Popconfirm, message, Tag, Result } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../utils/request';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Subscriber {
  mid: string;
  name: string;
  status: string;
  face?: string;  // 可选的头像URL
}

const Subscribers: React.FC = () => {
  const [newMid, setNewMid] = React.useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const queryClient = useQueryClient();

  // 获取订阅列表
  const { data: subscribers = [], isLoading, error } = useQuery<Subscriber[]>({
    queryKey: ['subscribers'],
    queryFn: () => request.get('/monitor/subscribers'),
    retry: 3,  // 失败时重试3次
    staleTime: 30000,  // 30秒内不重新请求
  });

  // 添加订阅
  const addSubscriber = useMutation({
    mutationFn: async (mid: string) => {
      try {
        const response = await request.post(`/monitor/subscribers/${mid}`);
        return response;
      } catch (error: any) {
        message.error(error.message || '添加失败');
        throw error;
      }
    },
    onSuccess: () => {
      message.success('添加成功');
      setNewMid('');
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });

  // 移除订阅
  const removeSubscriber = useMutation({
    mutationFn: async (mid: string) => {
      try {
        const response = await request.delete(`/monitor/subscribers/${mid}`);
        return response;
      } catch (error: any) {
        message.error(error.message || '移除失败');
        throw error;
      }
    },
    onSuccess: () => {
      message.success('移除成功');
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });

  const handleAdd = () => {
    if (!newMid) {
      message.error('请输入UID');
      return;
    }
    if (!/^\d+$/.test(newMid)) {
      message.error('UID必须是数字');
      return;
    }
    addSubscriber.mutate(newMid);
  };

  const columns = [
    {
      title: 'UID',
      dataIndex: 'mid',
      key: 'mid',
      width: isMobile ? 100 : 120,
    },
    {
      title: '主播',
      dataIndex: 'name',
      key: 'name',
      width: isMobile ? 120 : 150,
      render: (name: string, record: Subscriber) => (
        <Space>
          {record.face && (
            <img 
              src={record.face} 
              alt={name} 
              style={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%',
                marginRight: 8
              }} 
            />
          )}
          {name || '未获取到名称'}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        let text = '未知';
        if (status === '1') {
          color = 'success';
          text = '直播中';
        } else if (status === '0') {
          color = 'default';
          text = '未开播';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Subscriber) => (
        <Popconfirm
          title="确定要移除吗？"
          onConfirm={() => removeSubscriber.mutate(record.mid)}
        >
          <Button type="link" danger>
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <Result
          status="error"
          title="加载失败"
          subTitle={String(error)}
          extra={
            <Button 
              type="primary" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['subscribers'] })}
            >
              重试
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="添加订阅">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="请输入主播UID"
            value={newMid}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMid(e.target.value)}
            onPressEnter={handleAdd}
          />
          <Button 
            type="primary" 
            onClick={handleAdd}
            loading={addSubscriber.isPending}
          >
            添加
          </Button>
        </Space.Compact>
      </Card>

      <Card 
        title="订阅列表" 
        extra={
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subscribers'] })}
            loading={isLoading}
          >
            刷新
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={subscribers}
          rowKey="mid"
          loading={isLoading}
          pagination={false}
          scroll={{ x: isMobile ? 500 : undefined }}
        />
      </Card>
    </Space>
  );
};

export default Subscribers;
