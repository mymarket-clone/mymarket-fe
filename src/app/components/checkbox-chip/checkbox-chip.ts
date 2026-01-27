import { Component, output } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'

@Component({
  selector: 'app-checkbox-chip',
  templateUrl: './checkbox-chip.html',
})
export class CheckboxChip extends BaseInput {
  public onSelect = output()

  public toggle(): void {
    this.onSelect.emit()
    this.control().setValue(!this.control().value)
  }
}
