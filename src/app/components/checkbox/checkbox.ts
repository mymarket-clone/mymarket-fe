import { Component, input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { formErrorMessages } from '../../utils/formErrorMessages'

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  public label = input.required<string>()
  public clickableLabel = input.required<string>()
  public href = input.required<string>()
  public required = input.required<boolean>()
  public control = input.required<FormControl<boolean | null>>()
  public submitted = input.required<boolean>()

  public hasError(): boolean {
    const control = this.control()
    const errors = control.errors
    if (!errors) return false

    const isRequiredError = !!errors['required']

    if (!this.required() && isRequiredError) {
      return this.submitted()
    }

    return this.submitted() || control.touched || control.dirty
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

  public toggle(): void {
    const control = this.control()
    control.setValue(!control.value)
    control.markAsTouched()
  }
}
