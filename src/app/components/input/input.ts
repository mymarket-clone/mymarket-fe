import { NgTemplateOutlet } from '@angular/common'
import { Component, input, signal, TemplateRef } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-input',
  imports: [SvgIconComponent, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './input.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class Input extends BaseInput {
  public trailingContent = input<TemplateRef<unknown>>()
  public trailingBorderContent = input<TemplateRef<unknown>>()
  public bottomContent = input<TemplateRef<unknown>>()
  public showPlaceholder = input<boolean>(false)
  public maxValue = input<number | null>(null)
  public hidden = signal<boolean>(true)

  public inputType(): string {
    const type = this.type()
    return type !== 'password' ? type : this.hidden() ? 'password' : 'text'
  }

  public hasTrailingIcon(): boolean {
    return this.type() === 'password'
  }

  public toggleHiddenState(): void {
    this.hidden.set(!this.hidden())
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.type() !== 'number') return

    const max = this.maxValue()
    const input = event.target as HTMLInputElement

    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
    if (allowedKeys.includes(event.key)) return

    if (!/^\d$/.test(event.key)) {
      event.preventDefault()
      return
    }

    const value = input.value
    const start = input.selectionStart ?? value.length
    const end = input.selectionEnd ?? value.length

    const next = value.slice(0, start) + event.key + value.slice(end)

    if (max != null && Number(next) > max) {
      event.preventDefault()
    }
  }

  public onInput(event: Event): void {
    if (this.type() !== 'number') return

    const input = event.target as HTMLInputElement
    let value = input.value

    if (value.length === 2 && value.startsWith('0')) {
      value = value[1]
    }

    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '')
    }

    const max = this.maxValue()
    if (max != null && Number(value) > max) {
      value = String(max)
    }

    input.value = value
    this.control().setValue(value ? Number(value) : null, { emitEvent: false })
  }
}
