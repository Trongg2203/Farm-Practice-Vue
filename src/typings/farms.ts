// Interface cho đối tượng Location
export interface Location {
  latitude: number
  longitude: number
}

// Interface cho đối tượng Farm
export interface Farm {
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
  location: {
    latitude: number
    longitude: number
  }
  image: string
}

// Interface cho đối tượng Meta
export interface Meta {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// Interface cho phản hồi API
export interface ApiResponse {
  data: Farm[]
  meta: Meta
}

export interface CreateFarmRequest {
  id?: string
  name: string
  business_model: string
  business_type: string
  province: string
  district: string
  wards: string
  address: string
  region: string
  location: Location
  phoneNumber: string
  user_representative: string
  email: string
  image: string | File; // Nếu có thể có hình ảnh
}

// Interface cho dữ liệu yêu cầu cập nhật farm
export interface UpdateFarmRequest {
  name?: string
  business_model?: string
  business_type?: string
  province?: string
  district?: string
  wards?: string
  address?: string
  region?: string
  location?: Location
  phoneNumber?: string
  user_representative?: string
  email?: string
  image?: string | File;
}

// Interface cho phản hồi xóa farm
export interface DeleteFarmResponse {
  success: boolean
  message?: string
}
