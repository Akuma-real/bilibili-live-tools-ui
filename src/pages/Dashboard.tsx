import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import request from '../utils/request';
import type { MonitorStatus, LiverStatus } from '../types/api';

const Dashboard: React.FC = () => {
  const { data: monitorData } = useQuery<MonitorStatus>({
    queryKey: ['monitor'],
    queryFn: async () => {
      const response = await request.get<MonitorStatus>('/monitor/status');
      return response;
    },
    refetchInterval: 10000, // 每10秒刷新一次
  });

  const liverList = React.useMemo(() => {
    if (!monitorData?.status_cache) return [];
    return Object.entries(monitorData.status_cache).map(([mid, status]) => ({
      key: mid,
      ...status,
      mid
    }));
  }, [monitorData]);

  // 转换数据格式以适应表格
  const livers = React.useMemo(() => {
    if (!monitorData?.status_cache) return [];
    return Object.entries(monitorData.status_cache).map(([uid, status]) => ({
      uid,
      ...status,
      is_live: status.status === 1
    }));
  }, [monitorData]);

  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '主播',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '房间号',
      dataIndex: 'room_id',
      key: 'room_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = 'default';
        let text = '未知';
        switch (status) {
          case 1:
            color = 'success';
            text = '直播中';
            break;
          case 2:
            color = 'default';
            text = '未开播';
            break;
          case 0:
            color = 'warning';
            text = '未初始化';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '最后更新',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp * 1000).toLocaleString(),
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card 
        title="监控列表" 
        extra={
          <Button type="primary" onClick={() => refetch()}>
            刷新
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={livers} 
          rowKey="uid"
          pagination={false}
        />
      </Card>
    </Space>
  );
};

export default Dashboard;
