export type User = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: {
    id: number
    name: string
    lastName: string
    email: string
    emailVerified: boolean
  }
}
