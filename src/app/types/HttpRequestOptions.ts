import { HttpMethod } from './HttpMethod'

export type HttpRequestOptions<DataType, BodyType> = {
  method: HttpMethod
  endpoint: string
  body?: BodyType
  onSuccess?: (data: DataType) => void
  onError?: (errors: Record<string, string[]>) => void
}
