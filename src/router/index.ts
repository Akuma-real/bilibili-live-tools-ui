import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { message } from 'ant-design-vue'
import request from '@/utils/request'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue')
      },
      {
        path: 'subscribers',
        name: 'Subscribers',
        component: () => import('@/pages/Subscribers.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 验证 API Key 是否有效
const validateApiKey = async (apiKey: string) => {
  try {
    await request.get('/config/', {
      headers: {
        'X-API-Key': apiKey
      }
    })
    return true
  } catch {
    return false
  }
}

router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const apiKey = localStorage.getItem('apiKey')
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth) {
    if (!apiKey) {
      message.warning('请先登录')
      next('/login')
      return
    }

    // 验证 API Key
    const isValid = await validateApiKey(apiKey)
    if (!isValid) {
      message.error('登录已过期，请重新登录')
      localStorage.removeItem('apiKey')
      next('/login')
      return
    }
  }

  // 如果已登录且访问登录页，重定向到首页
  if (to.path === '/login' && apiKey) {
    next('/')
    return
  }

  next()
})

export default router
