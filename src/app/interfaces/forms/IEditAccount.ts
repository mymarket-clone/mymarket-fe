import { FormControl } from '@angular/forms'

export interface IEditAccount {
  firstname: FormControl<string | null>
  lastname: FormControl<string | null>
  email: FormControl<string | null>
  gender: FormControl<number | null>
  birthYear: FormControl<number | null>
  phoneNumber: FormControl<string | null>
}
