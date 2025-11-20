import { Component, input, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  public name = input.required<string>()
  public label = input.required<string>()
  public type = input.required<string>()
  public control = input.required<FormControl<string | null>>()
  public submitted = input.required<boolean>()

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

    const hasServerError = !!errors['server']

    return hasServerError || (this.submitted() && Object.values(errors).some((v) => !!v))
  }

  public getErrorMessage(): string | null {
    const control = this.control()
    if (!control.errors) return null

    const errorKey = Object.keys(control.errors)[0]

    switch (errorKey) {
      case 'server': {
        const serverErrors = control.errors['server']
        if (serverErrors && serverErrors[this.label()]) {
          return serverErrors[this.label()][0]
        }
        return null
      }
      case 'required': {
        return `${this.label()} is required`
      }
      case 'email': {
        return `Invalid email format`
      }
      case 'minlength': {
        return `${this.label()} must be at least ${control.errors['minlength'].requiredLength} characters`
      }
      case 'maxlength': {
        return `${this.label()} must be at most ${control.errors['maxlength'].requiredLength} characters`
      }
      default: {
        const value = control.errors[errorKey]
        if (Array.isArray(value)) return value[0] as string
        return value as string
      }
    }
  }
}
