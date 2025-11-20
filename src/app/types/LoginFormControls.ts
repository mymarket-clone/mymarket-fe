import { FormControl } from '@angular/forms'

export type LoginFormControls = {
  emailOrPhone: FormControl<string | null>
  password: FormControl<string | null>
}
