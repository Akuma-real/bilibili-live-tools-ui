import React from 'react';
import { Card, Table, Button, Input, Space, Popconfirm, message, Tag } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../utils/request';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Subscriber {
  mid: string;
  name: string;
  status: string;
}

const Subscribers: React.FC = () => {
  const [newMid, setNewMid] = React.useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const queryClient = useQueryClient();

  // 获取订阅列表
  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ['subscribers'],
    queryFn: () => request.get('/monitor/subscribers')
  });

  // 添加订阅
  const addSubscriber = useMutation({
    mutationFn: (mid: string) => request.post(`/monitor/subscribers/${mid}`),
    onSuccess: () => {
      message.success('添加成功');
      setNewMid('');
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });

  // 移除订阅
  const removeSubscriber = useMutation({
    mutationFn: (mid: string) => request.delete(`/monitor/subscribers/${mid}`),
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

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="添加订阅">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="请输入主播UID"
            value={newMid}
            onChange={e => setNewMid(e.target.value)}
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
