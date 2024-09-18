import axiosInstance from '@/axios/axiosInstance'
import type { IEditProfile, IIsUserLogged } from '@/typings/users/uses'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentUser: {} as IIsUserLogged | null
  }),
  getters: {},
  actions: {
    async getUserLogged() {
      try {
        const res = await axiosInstance.get<IIsUserLogged>('/users/my')
        this.currentUser = res.data
      } catch (error) {
        console.log('error', error)
      }
    },
    async editProfile(formProfile: FormData) {
      try {
        const response = await axiosInstance.put<IEditProfile>('/users', formProfile)
        return formProfile
      } catch (error) {
        console.log('error', error)
      }
    }
  }
})
