import { FormGroup } from '@angular/forms'

export type ServiceRequest<Body, Response> = {
  body: Body
  form?: FormGroup
  onSuccess?: (response: Response) => void
  onError?: (errors: Record<string, string[]> | string) => void
}
