import { Component, input, output, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BaseInput } from '../../shared/components/base-input/base-input'
import { InputType } from '../../types/Input'

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input<T = string> extends BaseInput<T> {
  public name = input.required<string>()
  public type = input.required<InputType>()
  public disabled = input<boolean>(false)
  public sendEmailButton = input<boolean>(false)
  public sendCodeActive = input<boolean>(false)
  public codeSent = input<boolean>(false)
  public codeSendLoading = input<boolean>(false)

  public sendClick = output()

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

  public handleSendCode(): void {
    if (this.sendCodeActive() || this.codeSendLoading()) return
    this.sendClick.emit()
  }
}
