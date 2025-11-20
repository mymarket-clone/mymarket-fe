export interface IBaseError {
  type: string
  title: string
  status: number
  instance: string
  errors: Record<string, string[]>
  Code: string
}

export interface IBaseSuccess<T> {
  data: T
}

export type IBaseResponse<T> = IBaseSuccess<T> | IBaseError
