import { FormControl } from '@angular/forms'

export type ISendEmailVerificationForm = {
  email: FormControl<string | null>
  code: FormControl<string | null>
}
