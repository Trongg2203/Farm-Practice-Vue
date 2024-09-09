import axiosInstance from '@/axios/axiosInstance'
import { defineStore } from 'pinia'

interface User {
  createdAt: string
  updatedAt: string
  id: string
  fullName: string
  jobTitle: string
  description: string
  avatar: string | null
  username: string
  email: string
  phoneNumber: string
  role: string
  isLocked: boolean
  homeTown: string
  address: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('authStore', {
  // initialize state
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null
  }),
  // gán vào trạng thái khởi tạo
  getters: {
    // !! đổi gtri bất kì thành tru false
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role == 'ADMIN',
    isUser: (state) => state.user?.role == 'USER',
    isLoggedIn: (state) => !!state.user && !!state.accessToken
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axiosInstance.post<AuthState>('/auth/login', {
          username,
          password
        })

        this.user = response.data.user
        this.accessToken = response.data.accessToken
        this.refreshToken = response.data.refreshToken

        // luu token
        // luu token
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }


        
        return response.data
      } catch (error) {
        console.error('Login failed', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null

      // xoa token
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },

    initializeAuthState() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const user = localStorage.getItem('user')

      if (accessToken && user) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.user = JSON.parse(user)

        return true
      }
      return false
    }
  }
})
