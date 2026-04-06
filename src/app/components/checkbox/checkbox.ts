import { Component, input } from '@angular/core'
import { BaseInput } from '@app/shared/components/base-input'

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.html',
})
export class Checkbox extends BaseInput<boolean> {
  public clickableLabel = input<string | undefined>(undefined)
  public href = input<string | undefined>(undefined)
  public size = input<'small' | 'default'>('default')

  public toggle(): void {
    const control = this.control()
    control.setValue(!control.value)
    control.markAllAsDirty()
  }
}
