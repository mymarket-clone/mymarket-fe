import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
})
export class Button {
  public handler = output()
  public title = input.required()
  public disabled = input<boolean>(false)

  public onHandler(): void {
    this.handler.emit()
  }
}
