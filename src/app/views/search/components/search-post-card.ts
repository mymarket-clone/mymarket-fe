import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Swiper } from '@app/components/swiper/swiper'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'
import { CurrencyType } from '@app/types/enums/CurrencyType'

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
    `,
  ],
})
export class SearchPostCard extends Swiper {
  public data = input.required<IPostDetails>()

  protected override get maxIndex(): number {
    return this.data().images.length - 1
  }

  public constructor() {
    super()
  }

  public getCurrencySymbol(): string {
    switch (this.data()?.currencyType) {
      case CurrencyType.GEL:
        return '₾'
      case CurrencyType.Dollar:
        return '$'
      default:
        return ''
    }
  }
}
