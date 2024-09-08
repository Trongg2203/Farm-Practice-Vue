import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashBoardView from '@/views/DashBoardView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: 'Login' },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashBoardView,
      meta: { requiresAuth: true, role: 'ADMIN' } // Sử dụng meta để lưu trữ yêu cầu quyền truy cập
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Khởi tạo trạng thái xác thực từ localStorage khi tải trang lần đầu
  if (!authStore.accessToken && authStore.initializeAuthState()) {
    authStore.accessToken = localStorage.getItem('accessToken')
    authStore.refreshToken = localStorage.getItem('refreshToken')
  }

  // yeu cau dang nhap
  if (to.meta.requiresAuth) {
    // kt đã login hay chua
    if (!authStore.isAuthenticated) {
      // chua dang nhap , chuyen sang dang nhap
      next({ name: 'Login' })
    } else if (to.meta.role && to.meta.role !== authStore.user?.role) {
      // neu dang nhap k đủ quyền
      next({ name: 'Home' })
    } else {
      // du quyền
      next()
    }
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // da dang nhap mà truy cap  trang login
    next({ name: 'Home' }) // chuyen huong sang trang phu hop
  } else {
    // Nếu trang không yêu cầu đăng nhập hoặc không thuộc các trường hợp trên
    next()
  }
})

export default router
