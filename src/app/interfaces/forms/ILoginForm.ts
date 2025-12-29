import { FormControl } from '@angular/forms'

export interface ILoginForm {
  emailOrPhone: FormControl<string | null>
  password: FormControl<string | null>
}
