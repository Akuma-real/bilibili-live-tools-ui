<template>
  <div class="subscribers">
    <a-card title="添加订阅">
      <a-space>
        <a-input
          v-model:value="newMid"
          placeholder="请输入主播UID"
          style="width: 200px"
          @keyup.enter="handleAdd"
          :disabled="isAdding"
        />
        <a-button 
          type="primary" 
          :loading="isAdding" 
          @click="handleAdd"
        >
          添加
        </a-button>
      </a-space>
    </a-card>

    <a-card 
      title="订阅列表" 
      style="margin-top: 16px"
    >
      <template #extra>
        <a-button 
          @click="handleRefresh" 
          :loading="isRefreshing"
        >
          刷新
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="subscribers"
        :loading="isLoading || isRefreshing"
        :pagination="false"
        rowKey="mid"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-space>
              <img 
                v-if="record.face" 
                :src="record.face" 
                :alt="record.name"
                style="width: 24px; height: 24px; border-radius: 50%"
              />
              {{ record.name || '未获取到名称' }}
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '1' ? 'success' : 'default'">
              {{ record.status === '1' ? '直播中' : '未开播' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'actions'">
            <a-popconfirm
              title="确定要移除吗？"
              @confirm="() => handleRemove(record.mid)"
              :disabled="removingMids.includes(record.mid)"
            >
              <a-button 
                type="link" 
                danger
                :loading="removingMids.includes(record.mid)"
                :disabled="removingMids.includes(record.mid)"
              >
                移除
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { message } from 'ant-design-vue';
import request from '@/utils/request';
import type { Subscriber } from '@/types/api';
import { QueryKeys } from '@/constants/queryKeys';

const newMid = ref('');
const isAdding = ref(false);
const isRefreshing = ref(false);
const removingMids = ref<string[]>([]);
const subscribers = ref<Subscriber[]>([]);

const columns = [
  {
    title: 'UID',
    dataIndex: 'mid',
    key: 'mid',
    width: 120,
  },
  {
    title: '主播',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
  },
];

const queryClient = useQueryClient();

const { isLoading, refetch } = useQuery({
  queryKey: ['subscribers'],
  queryFn: async () => {
    try {
      const response = await request.get<Subscriber[]>('/monitor/subscribers');
      subscribers.value = response;
      return response;
    } catch (error: any) {
      message.error('获取订阅列表失败');
      return [];
    }
  },
  refetchInterval: 30000,
});

const handleRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  try {
    await refetch();
    message.success('刷新成功');
  } catch (error) {
    message.error('刷新失败');
  } finally {
    isRefreshing.value = false;
  }
};

const handleAdd = async () => {
  if (isAdding.value) return;
  
  if (!newMid.value) {
    message.error('请输入UID');
    return;
  }
  if (!/^\d+$/.test(newMid.value)) {
    message.error('UID必须是数字');
    return;
  }

  // 检查是否已存在
  const existingSubscriber = subscribers.value?.find(s => s.mid === newMid.value);
  if (existingSubscriber) {
    message.warning(`${existingSubscriber.name || newMid.value} 已在监控列表中`);
    newMid.value = '';
    return;
  }

  isAdding.value = true;
  try {
    const response = await request.post(`/monitor/subscribers/${newMid.value}`);
    if (response.message?.includes('已在监控列表中')) {
      message.warning(`${response.name || newMid.value} 已在监控列表中`);
    } else {
      message.success('添加成功');
      // 同时刷新订阅列表和监控状态
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QueryKeys.SUBSCRIBERS }),
        queryClient.invalidateQueries({ queryKey: QueryKeys.MONITOR_STATUS })
      ]);
    }
    newMid.value = '';
  } catch (error: any) {
    message.error(error.response?.data?.detail || '添加失败');
  } finally {
    isAdding.value = false;
  }
};

const handleRemove = async (mid: string) => {
  if (removingMids.value.includes(mid)) return;
  
  removingMids.value.push(mid);
  try {
    await request.delete(`/monitor/subscribers/${mid}`);
    message.success('移除成功');
    // 同时刷新订阅列表和监控状态
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QueryKeys.SUBSCRIBERS }),
      queryClient.invalidateQueries({ queryKey: QueryKeys.MONITOR_STATUS })
    ]);
  } catch (error: any) {
    console.error('移除失败:', error);
    message.error(error.response?.data?.detail || '移除失败');
  } finally {
    removingMids.value = removingMids.value.filter(id => id !== mid);
  }
};
</script>

<style scoped>
.subscribers {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
