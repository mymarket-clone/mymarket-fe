import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-button-chevron',
  imports: [],
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
