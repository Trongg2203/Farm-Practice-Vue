import axiosInstance from '@/axios/axiosInstance'
import type {
  ApiResponse,
  CreateFarmRequest,
  DeleteFarmResponse,
  Farm,
  Meta,
  UpdateFarmRequest
} from '@/typings/farms'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useFarmsStore = defineStore('farmsStore', {
  state: () => ({
    farms: [] as Farm[], // Danh sách các farms (trang trại)
    meta: {} as Meta, // Thông tin phân trang từ API
    currentPage: 1, // Trang hiện tại đang được hiển thị
    isLoading: false, // Trạng thái đang tải (đang gọi API)
    error: null as string | null, // Thông báo lỗi nếu có lỗi xảy ra
    selectedFarm: null as Farm | null // Chi tiết của farm được chọn
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
          `/farm/all?order=ASC&page=${page}&take=2`
        )
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

    async fetchFarmDetail(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axiosInstance.get(`/farm?id=${id}`)  
        this.selectedFarm = response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('Axios Error', error.response?.data || error.message)
        } else {
          console.error('Unexpected Error:', error)
        }
      } finally {
        this.isLoading = false
      }
    },

    async createFarm(farmData: CreateFarmRequest) {
      this.isLoading = true
      this.error = null
      try {
        //'Content-Type': 'multipart/form-data' là một header HTTP quan trọng được sử dụng khi gửi dữ liệu từ client lên server,
        //đặc biệt là khi form chứa các file hoặc dữ liệu nhị phân
        //Đây là một HTTP header chỉ định kiểu nội dung của dữ liệu được gửi trong body của request.
        //multipart/form-data:
        //'multipart' nghĩa là dữ liệu được chia thành nhiều phần.
        //'form-data' chỉ ra rằng dữ liệu này đến từ một form HTML.
        const response = await axiosInstance.post('/farm/create-farm', farmData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        await this.fetchFarms(this.currentPage)
        return response.data
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
    async updateFarm(farmId: string, farmData: UpdateFarmRequest) {
      this.isLoading = true
      this.error = null
      try {
        await axiosInstance.put(`/farm/update-farm?id=${farmId}`, farmData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        await this.fetchFarms(this.currentPage)
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
    async deleteFarm(farmId: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axiosInstance.delete<DeleteFarmResponse>(`/farm/delete?id=${farmId}`)
        if (response.data.success) {
          await this.fetchFarms(this.currentPage)
        }
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
    async nextPage() {
      if (this.meta.hasNextPage) {
        await this.fetchFarms(this.currentPage + 1)
      }
    },
    async prevPage() {
      if (this.meta.hasPreviousPage) {
        await this.fetchFarms(this.currentPage - 1)
      }
    }
  }
})
