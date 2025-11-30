import { Component, input, signal } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Gender } from '../../types/enums/Gender'

@Component({
  selector: 'app-segmented',
  imports: [],
  templateUrl: './segmented.html',
  styleUrl: './segmented.scss',
})
export class Segmented {
  public segments = input.required<string[]>()
  public label = input.required<string>()
  public required = input.required<boolean>()
  public control = input.required<FormControl<number | null>>()
  public submitted = input.required<boolean>()

  public static = signal<boolean | null>(null)

  public setFirst(): void {
    this.static.set(false)
    this.control().setValue(Gender.Male)
  }

  public setSecond(): void {
    this.static.set(true)
    this.control().setValue(Gender.Male)
  }

  public hasError(): boolean {
    const control = this.control()
    const errors = control.errors
    if (!errors) return false

    const isRequiredError = !!errors['required']

    if (!this.required() && isRequiredError) {
      return this.submitted()
    }

    return this.submitted() || control.touched || control.dirty
  }
}
