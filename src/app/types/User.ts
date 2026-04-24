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
  favoritesCount: number
}
