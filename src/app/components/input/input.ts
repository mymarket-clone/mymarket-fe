import { Component, input, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { formErrorMessages } from '../../utils/formErrorMessages'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input<T = string> {
  public name = input.required<string>()
  public label = input.required<string>()
  public type = input.required<'text' | 'password' | 'email' | 'segmented'>()
  public control = input.required<FormControl<T | null>>()
  public submitted = input.required<boolean>()
  public required = input.required<boolean>()
  public disabled = input<boolean>(false)
  public sendEmailButton = input<boolean>(false)

  public passwordHidden = signal<boolean>(true)
  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)

  public sendEmailVerificationCodeState?: ReturnType<AuthService['sendEmailVerificationCode']>

  public constructor(private readonly authService: AuthService) {}

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

  public handleSendCode(): void {
    if (this.sendCodeActive() || this.sendEmailVerificationCodeState?.loading()) return

    this.sendEmailVerificationCodeState = this.authService.sendEmailVerificationCode({
      body: { email: this.control().value as string },
      onSuccess: () => {
        this.codeSent.set(true)
        this.sendCodeActive.set(true)

        setTimeout(() => this.sendCodeActive.set(false), 30000)
      },
      onError: (err) => console.error(err),
    })
  }
}
