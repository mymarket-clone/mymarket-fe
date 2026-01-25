import { Component, input, output } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'

@Component({
  selector: 'select-ship',
  templateUrl: './select-ship.html',
})
export class SelectChipM extends BaseInput {
  public items = input.required<Record<number | string, string> | null>()
  public values = input.required<number[] | string[]>()
  public onSelect = output()

  public select(item: number): void {
    this.onSelect.emit()
    this.control().setValue(item)
  }
}
