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
    farms: [] as Farm[], // Danh sách các farms (trang trại)
    meta: {} as Meta, // Thông tin phân trang từ API
    currentPage: 1, // Trang hiện tại đang được hiển thị
    isLoading: false, // Trạng thái đang tải (đang gọi API)
    error: null as string | null // Thông báo lỗi nếu có lỗi xảy ra
  }),
  getters: {
    hasPreviousPage: (state) => state.meta.hasPreviousPage,
    hasNextPage: (state) => state.meta.hasNextPage
  },
  actions: {
    async fetchFarms(page: number = 1) {
      // isLoading thành true để chỉ ra rằng dữ liệu đang được tải.
      this.isLoading = true
      this.error = null
      try {
        //Sau đó, nó gọi API để lấy dữ liệu, và nếu thành công, cập nhật farms, meta, và currentPage.
        const response = await axiosInstance.get<ApiResponse>(
          `/farm/all?order=ASC&page=${page}&take=1`
        )

        // console.log('API Response:', response.data)

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

    createFarm() {
      try {
      } catch (error) {}
    },
    async nextPage() {
      if (this.meta.hasNextPage) {
        // console.log('before next ', this.currentPage)
        await this.fetchFarms(this.currentPage + 1)
        // console.log('after next ', this.currentPage)
      }
    },
    async prevPage() {
      if (this.meta.hasPreviousPage) {
        // console.log('before prev ', this.currentPage)
        await this.fetchFarms(this.currentPage - 1)
        // console.log('after prev ', this.currentPage)
      }
    }
  }
})
