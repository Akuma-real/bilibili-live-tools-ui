import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.use(Antd)

app.mount('#app')
