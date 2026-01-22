import { FormGroup } from '@angular/forms'
import { IBaseError } from '../response/IBaseResponse'
import { SearchParams } from '../../types/SearchParams'

export interface IServiceRequest<Body, Response> {
  body?: Body
  searchParams?: SearchParams
  form?: FormGroup
  onSuccess?: (response: Response) => void
  onError?: (errors: Record<string, string[]> | string, record?: IBaseError) => void
}
