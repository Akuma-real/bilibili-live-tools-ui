<template>
  <div class="dashboard">
    <a-card title="监控状态">
      <a-table
        :columns="columns"
        :data-source="livers"
        :loading="isLoading"
        :pagination="false"
        rowKey="uid"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.is_live ? 'success' : 'default'">
              {{ record.is_live ? '直播中' : '未开播' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'title'">
            <span v-if="record.title">{{ record.title }}</span>
            <span v-else>-</span>
          </template>
          <template v-if="column.key === 'actions'">
            <a-button 
              type="link" 
              :href="`https://live.bilibili.com/${record.room_id}`" 
              target="_blank"
              v-if="record.room_id"
            >
              查看直播间
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import request from '@/utils/request';
import type { MonitorStatus } from '@/types/api';
import { QueryKeys } from '@/constants/queryKeys';

const queryClient = useQueryClient();

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
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'actions',
  },
];

const { data: monitorData, isLoading } = useQuery({
  queryKey: QueryKeys.MONITOR_STATUS,
  queryFn: () => request.get<MonitorStatus>('/monitor/status'),
  refetchInterval: 10000,
});

// 当订阅列表更新时，刷新监控状态
queryClient.invalidateQueries({ queryKey: QueryKeys.MONITOR_STATUS });

const livers = computed(() => {
  if (!monitorData.value?.status_cache) return [];
  return Object.entries(monitorData.value.status_cache).map(([uid, status]) => ({
    uid,
    ...status,
    is_live: status.status === 1,
  }));
});
</script>
