import axiosInstance from '@/axios/axiosInstance'
import axios from 'axios'
import { defineStore } from 'pinia'

// Interface cho đối tượng Location
interface Location {
  latitude: number
  longitude: number
}

// Interface cho đối tượng Farm
interface Farm {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  business_model: string
  business_type: string
  province: string
  district: string
  wards: string
  address: string
  region: string
  phoneNumber: string
  user_representative: string
  email: string
  location: Location
  image: string
}

// Interface cho đối tượng Meta
interface Meta {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// Interface cho phản hồi API
interface ApiResponse {
  data: Farm[]
  meta: Meta
}

export const useFarmsStore = defineStore('farmsStore', {
  state: () => ({
    farms: [] as Farm[],
    meta: {} as Meta,
    currentPage: 1,
    isLoading: false,
    error: null as string | null
  }),
  getters: {
    hasPreviousPage: (state) => state.meta.hasPreviousPage,
    hasNextPage: (state) => state.meta.hasNextPage
  },
  actions: {
    async fetchFarms(page: number = 1) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axiosInstance.get<ApiResponse>(
          `/farm/all?order=ASC&page=${page}&take=1`
        )

        console.log('API Response:', response.data)
        this.farms = response.data.data
        this.meta = response.data.meta
        this.currentPage = page
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('AxiosError:', error.response?.data || error.message)
        } else {
          console.error('Unexpected Error:', error)
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },
    nextPage() {
      if (this.meta.hasNextPage) {
        // this.fetchFarms(this.currentPage + 1)
        this.currentPage++
      }
    },
    prevPage() {
      if (this.meta.hasPreviousPage) {
        // this.fetchFarms(this.currentPage - 1)

        this.currentPage++
      }
    }
  }
})
