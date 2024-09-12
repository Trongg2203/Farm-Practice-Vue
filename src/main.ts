import './assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)

app.use(createPinia())

// Khởi tạo trạng thái xác thực từ localStorage khi ứng dụng khởi động
// const authStore = useAuthStore()
// authStore.initializeAuthState()

app.use(router)

app.mount('#app')
