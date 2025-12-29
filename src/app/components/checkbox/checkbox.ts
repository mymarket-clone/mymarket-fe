import { Component, input } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
})
export class Checkbox extends BaseInput<boolean> {
  public clickableLabel = input.required<string>()
  public href = input.required<string>()

  public toggle(): void {
    const control = this.control()
    control.setValue(!control.value)
    control.markAllAsDirty()
  }
}
