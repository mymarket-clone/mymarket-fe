import { Component, input, signal } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'
import { Gender } from '../../types/enums/Gender'

@Component({
  selector: 'app-segmented',
  templateUrl: './segmented.html',
})
export class Segmented extends BaseInput {
  public segments = input.required<string[]>()
  public static = signal<boolean>(false)

  public setFirst(): void {
    this.static.set(false)
    this.control().setValue(Gender.Male)
  }

  public setSecond(): void {
    this.static.set(true)
    this.control().setValue(Gender.Female)
  }
}
