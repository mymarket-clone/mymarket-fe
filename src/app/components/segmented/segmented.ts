import { Component, input, signal } from '@angular/core'
import { BaseInput } from '@app/shared/components/base-input'
import { Gender } from '@app/types/enums/Gender'

@Component({
  selector: 'app-segmented',
  templateUrl: './segmented.html',
})
export class Segmented extends BaseInput {
  public segments = input.required<string[]>()
  public static = signal<boolean>(false)

  public ngOnInit(): void {
    this.control().valueChanges.subscribe((value) => {
      this.static.set(value === Gender.Female)
    })

    const value = this.control().value
    this.static.set(value === Gender.Female)
  }

  public setFirst(): void {
    this.static.set(false)
    this.control().setValue(Gender.Male)
  }

  public setSecond(): void {
    this.static.set(true)
    this.control().setValue(Gender.Female)
  }
}
