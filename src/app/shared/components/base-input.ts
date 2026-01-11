import { Component, input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { InputType } from '../../types/Input'

@Component({
  selector: 'app-base-input',
  template: '',
})
export class BaseInput<T = unknown> {
  public label = input<string>()
  public control = input.required<FormControl<T>>()
  public required = input<boolean>(false)
  public submitted = input.required<boolean>()
  public disabled = input<boolean>(false)
  public type = input<InputType>('text')

  public hasError(): boolean {
    const control = this.control()
    if (!control) return false
    if (control.errors?.['set']) return true

    return !!control.errors && this.submitted()
  }

  public getError(): string | null {
    const ctrl = this.control()
    if (!ctrl || !ctrl.errors) return null
    const firstKey = Object.keys(ctrl.errors)[0]
    return firstKey ? (ctrl.errors[firstKey] as string) : null
  }
}
