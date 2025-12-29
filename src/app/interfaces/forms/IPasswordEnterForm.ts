import { FormControl } from '@angular/forms'

export interface IPasswordEnterForm {
  code: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
}
