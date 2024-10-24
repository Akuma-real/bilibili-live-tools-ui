<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo">BLV Monitor</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px', flex: 1 }"
      >
        <a-menu-item key="dashboard" @click="$router.push('/')">
          <dashboard-outlined /> 监控面板
        </a-menu-item>
        <a-menu-item key="subscribers" @click="$router.push('/subscribers')">
          <user-outlined /> 订阅管理
        </a-menu-item>
        <a-menu-item key="settings" @click="$router.push('/settings')">
          <setting-outlined /> 系统设置
        </a-menu-item>
      </a-menu>
      <a-button type="link" style="color: #fff" @click="handleLogout">
        <logout-outlined /> 退出
      </a-button>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const selectedKeys = ref<string[]>(['dashboard'])

watch(() => route.path, (path) => {
  if (path === '/') {
    selectedKeys.value = ['dashboard']
  } else {
    selectedKeys.value = [path.slice(1)]
  }
}, { immediate: true })

const handleLogout = () => {
  localStorage.removeItem('apiKey')
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo {
  color: white;
  margin-right: 24px;
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 24px;
  background: #f0f2f5;
}

@media (max-width: 768px) {
  .content {
    padding: 12px;
  }
  
  .header {
    padding: 0 12px;
  }
  
  .logo {
    margin-right: 12px;
  }
}
</style>
