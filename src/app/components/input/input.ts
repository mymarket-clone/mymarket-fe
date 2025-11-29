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
    const hasServerError = !!errors['server']

    return hasServerError || false
  }

  public getErrorMessage(): string | null {
    const control = this.control()
    if (!control.errors || !control.errors['server']) return null
    return control.errors['server']
  }
}
