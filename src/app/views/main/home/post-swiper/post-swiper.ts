import { Component, input } from '@angular/core'
import { Swiper } from '../../../../components/swiper/swiper'
import { IPostLite } from '../../../../interfaces/response/IPostLite'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink } from '@angular/router'
import { TranslocoDirective } from '@jsverse/transloco'
import { ProuductCard } from './post-card/post-card'

@Component({
  selector: 'app-post-swiper',
  templateUrl: 'post-swiper.html',
  imports: [SvgIconComponent, RouterLink, TranslocoDirective, ProuductCard],
})
export class PostSwiper extends Swiper {
  public data = input<IPostLite[]>()
  public meta = input.required<{
    title: string
    query: Record<string, unknown>
    icon: string
    color: string
  }>()

  public constructor() {
    super()
  }

  protected override get maxIndex(): number {
    const length = this.data()?.length ?? 0
    return Math.max(Math.ceil(length / 6) - 1, 0)
  }
}
