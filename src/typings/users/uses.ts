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
  phoneNumber:string
  description: string
  avatar: string | File
  user: string
  role: string
  homeTown:string
  address: string
  email:string
}
