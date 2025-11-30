import { FormControl } from '@angular/forms'

export type RegisterForm = {
  name: FormControl<string | null>
  lastname: FormControl<string | null>
  email: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
  gender: FormControl<number | null>
  birthYear: FormControl<number | null>
  phoneNumber: FormControl<string | null>
  termsAndConditions: FormControl<boolean | null>
  privacyPolicy: FormControl<boolean | null>
}
