import { Component, input } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'

@Component({
  selector: 'select-ship',
  templateUrl: './select-ship.html',
})
export class SelectChipM extends BaseInput {
  public items = input.required<Record<number | string, string> | null>()
  public values = input.required<number[] | string[]>()
}
