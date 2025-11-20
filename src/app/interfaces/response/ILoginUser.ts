import { IBaseResponse } from './IBaseResponse'

export type ILoginUser = IBaseResponse<{
  accessToken: string
  refreshToken: string
  expriesAt: string
  user: {
    id: number
    name: string
    lastname: string
    email: string
    emailVerified: boolean
  }
}>
