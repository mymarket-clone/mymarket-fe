import { FormControl } from '@angular/forms'

export type SendEmailVerificationForm = {
  email: FormControl<string | null>
  code: FormControl<string | null>
}
