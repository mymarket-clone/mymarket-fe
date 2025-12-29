import { FormGroup } from '@angular/forms'
import { IBaseError } from '../response/IBaseResponse'

export interface IServiceRequest<Body, Response> {
  body: Body
  form?: FormGroup
  onSuccess?: (response: Response) => void
  onError?: (errors: Record<string, string[]> | string, record?: IBaseError) => void
}
