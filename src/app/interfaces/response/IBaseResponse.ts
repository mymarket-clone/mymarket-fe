export interface IBaseError {
  type: string
  title: string
  status: number
  instance: string
  errors: Record<string, string[]>
  code: string
  email?: string
  requiredAmount?: number
  currentBalance?: number
}

export interface IBaseSuccess<T> {
  data: T
}

export type IBaseResponse<T> = IBaseSuccess<T> | IBaseError
