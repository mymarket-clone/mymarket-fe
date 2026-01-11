import { Component, signal } from '@angular/core'
import { HighlightDirective } from '../../modules/directives/highlight'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [HighlightDirective, ReactiveFormsModule, SvgIconComponent],
})
export class Dropdown extends BaseInput {
  public selecting = signal<boolean>(false)
}
