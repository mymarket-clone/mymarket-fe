import { Component, input, output } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-button-chevron',
  imports: [SvgIconComponent],
  templateUrl: './button-chevron.html',
  styleUrl: './button-chevron.scss',
})
export class ButtonChevron {
  public title = input<string>()
  public onClick = output<void>()

  public handleClick(): void {
    this.onClick.emit()
  }
}
