import { Component, input } from '@angular/core'
import { InlineSVGModule } from 'ng-inline-svg'
import { SvgIconComponent } from 'angular-svg-icon'
import { ButtonType, ImgType } from '../../types/GenericTypes'

@Component({
  selector: 'app-button',
  imports: [InlineSVGModule, SvgIconComponent],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public title = input<string>()
  public type = input<ButtonType>('button')
  public borderOnHover = input<boolean>(false)
  public imgType = input<ImgType>('img')
  public src = input<string>()
  public color = input.required<'blue' | 'raisin'>()
  public disabled = input<boolean>(false)
}
