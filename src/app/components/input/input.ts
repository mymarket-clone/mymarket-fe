import { Component, input, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { formErrorMessages } from '../../utils/formErrorMessages'

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  public name = input.required<string>()
  public label = input.required<string>()
  public type = input.required<'text' | 'password' | 'email'>()
  public control = input.required<FormControl<string | null>>()
  public submitted = input.required<boolean>()
  public required = input.required<boolean>()

  public passwordHidden = signal<boolean>(true)

  public inputType(): string {
    const type = this.type()
    return type !== 'password' ? type : this.passwordHidden() ? 'password' : 'text'
  }

  public hasTrailingIcon(): boolean {
    return this.type() === 'password'
  }

  public togglePasswordVisibility(): void {
    this.passwordHidden.set(!this.passwordHidden())
  }

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
}
