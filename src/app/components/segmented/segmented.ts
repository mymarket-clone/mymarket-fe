import { Component, input, signal } from '@angular/core'
import { Gender } from '../../types/enums/Gender'
import { BaseInput } from '../../shared/components/base-input/base-input'

@Component({
  selector: 'app-segmented',
  imports: [],
  templateUrl: './segmented.html',
  styleUrl: './segmented.scss',
})
export class Segmented extends BaseInput<number> {
  public segments = input.required<string[]>()

  public static = signal<boolean | null>(null)

  public setFirst(): void {
    this.static.set(false)
    this.control().setValue(Gender.Male)
  }

  public setSecond(): void {
    this.static.set(true)
    this.control().setValue(Gender.Male)
  }
}
