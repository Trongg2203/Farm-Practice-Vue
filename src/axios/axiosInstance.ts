import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://118.69.126.49:8878/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// rq interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },

  (err) => {
    return Promise.reject(err)
  }
)

//response interceptor

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const authStore = useAuthStore()

    // kt token or het han token
    if (error.response && error.response.status === 401) {
      authStore.logout()

      // chuyen den trang login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
