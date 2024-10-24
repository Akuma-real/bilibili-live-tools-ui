<template>
  <div class="settings">
    <a-card title="系统配置">
      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item
          label="B站 Cookies"
          name="bilibili_cookies"
          :rules="[{ required: true, message: '请输入B站 Cookies' }]"
        >
          <div class="password-wrapper">
            <a-input
              v-model:value="formState.bilibili_cookies"
              :type="showCookies ? 'text' : 'password'"
              placeholder="请输入B站 Cookies"
            />
            <eye-invisible-outlined 
              v-if="!showCookies" 
              class="password-icon"
              @click="showCookies = true"
            />
            <eye-outlined 
              v-else 
              class="password-icon"
              @click="showCookies = false"
            />
          </div>
        </a-form-item>

        <a-form-item
          label="Server酱 Key"
          name="server_chan_key"
        >
          <div class="password-wrapper">
            <a-input
              :value="formState.server_chan_key"
              placeholder="Server酱 Key"
              :type="showServerKey ? 'text' : 'password'"
              disabled
              readonly
            />
            <eye-invisible-outlined 
              v-if="!showServerKey" 
              class="password-icon"
              @click="showServerKey = true"
            />
            <eye-outlined 
              v-else 
              class="password-icon"
              @click="showServerKey = false"
            />
          </div>
          <template #help>
            <span class="help-text">此配置项只通过环境变量修改</span>
          </template>
        </a-form-item>

        <a-form-item
          label="Cloudflare 域名"
          name="cloudflare_domain"
        >
          <a-input
            v-model:value="formState.cloudflare_domain"
            placeholder="Cloudflare 域名"
            disabled
            readonly
          />
          <template #help>
            <span class="help-text">此配置项只能通过环境变量修改</span>
          </template>
        </a-form-item>

        <a-form-item
          label="Cloudflare 授权码"
          name="cloudflare_auth_code"
        >
          <div class="password-wrapper">
            <a-input
              :value="formState.cloudflare_auth_code"
              placeholder="Cloudflare 授权码"
              :type="showAuthCode ? 'text' : 'password'"
              disabled
              readonly
            />
            <eye-invisible-outlined 
              v-if="!showAuthCode" 
              class="password-icon"
              @click="showAuthCode = true"
            />
            <eye-outlined 
              v-else 
              class="password-icon"
              @click="showAuthCode = false"
            />
          </div>
          <template #help>
            <span class="help-text">此配置项只能通过环境变量修改</span>
          </template>
        </a-form-item>

        <a-form-item
          label="检查间隔(秒)"
          name="check_interval"
        >
          <a-input-number
            v-model:value="formState.check_interval"
            :min="30"
            :max="3600"
            style="width: 200px"
            disabled
            readonly
          />
          <template #help>
            <span class="help-text">此配置项只能通过环境变量修改</span>
          </template>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button 
              type="primary" 
              html-type="submit"
              :loading="isSubmitting"
            >
              更新 Cookies
            </a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { message } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import request from '@/utils/request'
import type { MonitorConfig } from '@/types/api'

const showCookies = ref(false)
const showServerKey = ref(false)
const showAuthCode = ref(false)
const isSubmitting = ref(false)

const formState = reactive<MonitorConfig>({
  cloudflare_domain: '',
  cloudflare_auth_code: '',
  server_chan_key: '',
  bilibili_cookies: '',
  check_interval: '60'
})

// 获取配置
const { data: config, refetch } = useQuery({
  queryKey: ['config'],
  queryFn: async () => {
    const response = await request.get<MonitorConfig>('/config/')
    Object.assign(formState, response)
    return response
  }
})

// 更新 Cookies
const updateCookies = useMutation({
  mutationFn: async (cookies: string) => {
    try {
      // 修改为使用 URL 参数传递 cookies
      await request.post(`/config/bilibili/cookies?cookies=${encodeURIComponent(cookies)}`, '')
      message.success('Cookies 已更新')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '更新失败')
      throw error
    }
  }
})

// 重新加载配置
const reloadConfig = useMutation({
  mutationFn: async () => {
    try {
      await request.post('/config/reload')
      message.success('配置已重新加载')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '重新加载失败')
      throw error
    }
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (formState.bilibili_cookies !== config.value?.bilibili_cookies) {
      await updateCookies.mutateAsync(formState.bilibili_cookies)
      await reloadConfig.mutateAsync()
      await refetch()
    }
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  if (config.value) {
    Object.assign(formState, config.value)
  }
}
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  z-index: 1;
  padding: 4px;
}

.password-icon:hover {
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-input[disabled]) {
  padding-right: 30px !important;
}

.help-text {
  color: #999;
  font-size: 12px;
  user-select: none;
  cursor: default;
  pointer-events: none;
}
</style>
