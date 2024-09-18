export interface User {
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

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export interface Register {
  id?: string
  username: string
  password: string
  fullName: string
  email: string
  jobTitle: string
  phoneNumber: string
  description: string
  address: string
  homeTown: string
  avatar: string | File
  role: string
}
