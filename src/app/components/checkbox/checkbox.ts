import { Component, input } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input/base-input'

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox extends BaseInput<boolean> {
  public clickableLabel = input.required<string>()
  public href = input.required<string>()

  public toggle(): void {
    const control = this.control()
    control.setValue(!control.value)
    control.markAsTouched()
  }
}
