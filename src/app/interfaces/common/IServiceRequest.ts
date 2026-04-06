import { FormGroup } from '@angular/forms'
import { SearchParams } from '@app/types/SearchParams'
import { IBaseError } from '../response/IBaseResponse'

export interface IServiceRequest<Body, Response> {
  body?: Body
  searchParams?: SearchParams
  form?: FormGroup | FormGroup[]
  formData?: FormData
  onSuccess?: (response: Response) => void
  onError?: (errors: Record<string, string[]> | string, record?: IBaseError) => void
}
