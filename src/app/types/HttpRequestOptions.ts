import { IBaseError } from '../interfaces/response/IBaseResponse'
import { HttpMethod } from './enums/HttpMethod'

export type HttpRequestOptions<DataType, BodyType> = {
  method: HttpMethod
  endpoint: string
  body?: BodyType
  onSuccess?: (data: DataType) => void
  onError?: (errors: Record<string, string[]>, record?: IBaseError) => void
}
