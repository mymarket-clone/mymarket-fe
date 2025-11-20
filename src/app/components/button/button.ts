import { Component, input } from '@angular/core'

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public title = input<string>()
  public type = input<'button' | 'submit'>('button')
  public borderOnHover = input<boolean>(false)
  public img = input<string>()
  public color = input.required<'blue' | 'raisin'>()
  public disabled = input<boolean>(false)
}
