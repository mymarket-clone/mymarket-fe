import { FormControl } from '@angular/forms'

export type RegisterForm = {
  name: FormControl<string | null>
  lastname: FormControl<string | null>
  email: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
}
