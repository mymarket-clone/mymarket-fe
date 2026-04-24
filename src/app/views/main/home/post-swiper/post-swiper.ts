import { Component, input, output } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink } from '@angular/router'
import { TranslocoDirective } from '@jsverse/transloco'
import { ProuductCard } from './post-card/post-card'
import { Swiper } from '@app/components/swiper/swiper'
import { IPostLite } from '@app/interfaces/response/IPostLite'

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

  public favoriteChange = output<{ id: number; value: boolean }>()

  protected override get maxIndex(): number {
    const length = this.data()?.length ?? 0
    return Math.max(Math.ceil(length / 6) - 1, 0)
  }

  public onFavoriteChange(event: { id: number; value: boolean }): void {
    this.favoriteChange.emit(event)
  }
}
