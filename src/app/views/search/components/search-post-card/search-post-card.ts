import { Component, HostBinding, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Swiper } from '@app/components/swiper/swiper'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'
import { Utils } from '@app/utils/Utils'

@Component({
  selector: 'search-post-card',
  templateUrl: 'search-post-card.html',
  imports: [RouterLink, SvgIconComponent, TranslocoDirective],
  styles: [
    `
      button:hover svg path {
        fill: white;
      }

      :host ::ng-deep span strong {
        font-weight: normal;
      }

      :host(.list) {
        width: 100%;
      }

      :host(.card) {
        width: 100%;

        @media (width >= 1280px) {
          max-width: 237px;
        }
      }
    `,
  ],
})
export class SearchPostCard extends Swiper {
  public size = input<'card' | 'list'>('card')
  public data = input.required<IPostDetails>()

  protected override get maxIndex(): number {
    return this.data().images.length - 1
  }

  public constructor(public readonly utils: Utils) {
    super()
  }

  @HostBinding('class.list')
  public get isList(): boolean {
    return this.size() === 'list'
  }

  @HostBinding('class.card')
  public get isCard(): boolean {
    return this.size() === 'card'
  }
}
