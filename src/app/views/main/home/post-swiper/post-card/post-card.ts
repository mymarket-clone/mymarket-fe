import { CurrencyType } from './../../../../../types/enums/CurrencyType'
import { Component, input } from '@angular/core'
import { Swiper } from '../../../../../components/swiper/swiper'
import { RouterLink } from '@angular/router'
import { IPostLite } from '../../../../../interfaces/response/IPostLite'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html',
  imports: [RouterLink, SvgIconComponent, TranslocoDirective],
})
export class ProuductCard extends Swiper {
  public post = input.required<IPostLite>()
  public currencyType = CurrencyType

  protected override get maxIndex(): number {
    return (this.post().images?.length ?? 1) - 1
  }
}
