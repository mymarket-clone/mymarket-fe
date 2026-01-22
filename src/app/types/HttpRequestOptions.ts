import { FormGroup } from '@angular/forms'
import { IBaseError } from '../interfaces/response/IBaseResponse'
import { HttpMethod } from './enums/HttpMethod'
import { SearchParams } from './SearchParams'

export type HttpRequestOptions<DataType, BodyType> = {
  method: HttpMethod
  endpoint: string
  searchParams?: SearchParams
  body?: BodyType
  form?: FormGroup
  onSuccess?: (data: DataType) => void
  onError?: (errors: Record<string, string[]>, record?: IBaseError) => void
}
