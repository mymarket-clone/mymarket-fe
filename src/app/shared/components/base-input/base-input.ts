import { Component, input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { formErrorMessages } from '../../../utils/formErrorMessages'

@Component({
  selector: 'app-base-input',
  imports: [],
  templateUrl: './base-input.html',
  styleUrl: './base-input.scss',
})
export class BaseInput<T = string> {
  public label = input.required<string>()
  public required = input.required<boolean>()
  public control = input.required<FormControl<T | null>>()
  public submitted = input.required<boolean>()

  public hasError(): boolean {
    const control = this.control()
    if (!control) return false
    return !!control.errors && (control.touched || control.dirty)
  }

  public getErrorMessage(): string | null {
    const control = this.control()
    const errors = control.errors

    if (!errors) return null
    if (errors['server']) return errors['server']

    const errorKey = Object.keys(errors)[0]
    const handler = formErrorMessages[errorKey]

    return handler ? handler(errors[errorKey]) : 'Invalid value'
  }
}
