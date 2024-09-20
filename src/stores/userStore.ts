import axiosInstance from '@/axios/axiosInstance'
import {
  type ApiUserRes,
  type IDeleteUserResponse,
  type IEditProfile,
  type IIsUserLogged,
  type IUser,
  type MetaUser
} from '@/typings/users/user'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    roles: ['ADMIN,USER'],
    users: [] as IUser[], // ds users
    meta: {} as MetaUser, // phan trang tu api
    isLoading: false, // trang thai loading
    error: null,
    currentPage: 1,
    currentUser: {} as IIsUserLogged | null
  }),
  getters: {},
  actions: {
    async createUser(userData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const res = await axiosInstance.post('/users', userData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        await this.getAllUser(this.currentPage)
        return res.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('AxiosError:', error.response?.data || error.message)
        } else {
          console.error('Unexpected Error:', error)
        }
        throw this.error
      } finally {
        this.isLoading = false
      }
    },
    async getUserLogged() {
      try {
        const res = await axiosInstance.get<IIsUserLogged>('/users/my')
        this.currentUser = res.data
      } catch (error) {
        console.log('error', error)
      }
    },
    async getAllUser(page: number = 1, take: number = 10) {
      this.isLoading = true
      this.error = null
      try {
        const res = await axiosInstance.get<ApiUserRes>(
          `/users?order=ASC&page=${page}&take=${take}`
        )
        this.meta = res.data.meta
        this.users = res.data.data
        this.currentPage = page
      } catch (error) {
        console.log('error', error)
      } finally {
        this.isLoading = false
      }
    },
    async editProfile(formProfile: FormData) {
      try {
        const res = await axiosInstance.put<IEditProfile>('/users', formProfile, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.getUserLogged()
        return res
      } catch (error) {
        console.log('error', error)
      } finally {
        this.isLoading = false
      }
    },

    async deleteUser(userId: string) {
      this.isLoading = true
      this.error = null
      try {
        const res = await axiosInstance.delete<IDeleteUserResponse>(`/users?id=${userId}`)
        if (res.data.success) {
          await this.getAllUser(this.currentPage)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('AxiosError:', error.response?.data || error.message)
        } else {
          console.error('Unexpected Error:', error)
        }
        throw this.error
      } finally {
        this.isLoading = false
      }
    }
  }
})
