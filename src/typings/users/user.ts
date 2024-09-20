export interface IEditProfile {
  fullName: string
  jobTitle: string
  phoneNumber: string
  description: string
  address: string
  homeTown: string
  avatar: string | File
}

export interface IIsUserLogged {
  id?: string
  fullName: string
  jobTitle: string
  phoneNumber: string
  description: string
  avatar: string | File
  user: string
  role: string
  homeTown: string
  address: string
  email: string
}
export interface IUser {
  id?: string
  password:string
  fullName: string
  jobTitle: string
  description: string
  avatar: string | File
  username: string
  email: string
  phoneNumber: string
  role: 'ADMIN' | 'USER' // Sử dụng union type cho role
  isLocked: boolean
  homeTown: string
  address: string
}

export interface MetaUser {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ApiUserRes {
  data: IUser[]
  meta: MetaUser
}
export interface IDeleteUserResponse {
  success: boolean
  message?: string
}