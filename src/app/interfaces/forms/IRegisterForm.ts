import { FormControl } from '@angular/forms'

export interface IRegisterFormMain {
  firstname: FormControl<string | null>
  lastname: FormControl<string | null>
  email: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
}

export interface IRegisterFormExtra {
  gender: FormControl<number | null>
  birthYear: FormControl<number | null>
  phoneNumber: FormControl<string | null>
  termsAndConditions: FormControl<boolean>
  privacyPolicy: FormControl<boolean>
}

export interface IRegisterFormVerification {
  email: FormControl<string | null>
  code: FormControl<string | null>
}
