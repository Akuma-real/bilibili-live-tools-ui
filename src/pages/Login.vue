<template>
  <div class="login-container">
    <a-card title="BLV Monitor" class="login-card">
      <a-form
        :model="formState"
        @finish="handleSubmit"
        layout="vertical"
      >
        <a-form-item
          label="API Key"
          name="apiKey"
          :rules="[{ required: true, message: '请输入 API Key' }]"
        >
          <a-input-password
            v-model:value="formState.apiKey"
            placeholder="请输入 API Key"
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)
const formState = reactive({
  apiKey: ''
})

const handleSubmit = async (values: { apiKey: string }) => {
  loading.value = true
  try {
    // 使用 config 接口验证 API Key
    await request.get('/config/', {
      headers: {
        'X-API-Key': values.apiKey
      }
    })
    // 验证成功，保存 API Key
    localStorage.setItem('apiKey', values.apiKey)
    message.success('登录成功')
    router.push('/')
  } catch (error: any) {
    message.error(error.response?.data?.detail || '验证失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 360px;
  margin: 0 16px;
}

.login-card :deep(.ant-card-head-title) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
</style>
