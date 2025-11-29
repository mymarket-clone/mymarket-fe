import { FormControl } from '@angular/forms'

export type LoginForm = {
  emailOrPhone: FormControl<string | null>
  password: FormControl<string | null>
}
