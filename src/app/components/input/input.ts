import { NgTemplateOutlet } from '@angular/common'
import { Component, input, signal, TemplateRef } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-input',
  imports: [SvgIconComponent, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './input.html',
})
export class Input extends BaseInput {
  public trailingContent = input<TemplateRef<unknown>>()
  public bottomContent = input<TemplateRef<unknown>>()
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
}
