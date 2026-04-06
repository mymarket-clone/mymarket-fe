import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'
import { Swiper } from '@app/components/swiper/swiper'
import { IPostLite } from '@app/interfaces/response/IPostLite'
import { CurrencyType } from '@app/types/enums/CurrencyType'

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
