import { Gender } from './enums/Gender'

export type User = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: UserDetail
}

export type UserDetail = {
  id: number
  name: string
  lastname: string
  email: string
  emailVerified: boolean
  firstname: string
  favoritesCount: number
  number: string | null
  genderType: Gender
  birthYear: number
}
