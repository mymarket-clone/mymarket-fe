import { FormControl } from '@angular/forms'

export type PasswordEnterForm = {
  code: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
}
