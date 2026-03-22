import { Component, input } from '@angular/core'
import { Swiper } from '../../../../components/swiper/swiper'
import { IPostLite } from '../../../../interfaces/response/IPostLite'

@Component({
  selector: 'app-post-swiper',
  templateUrl: 'post-swiper.html',
})
export class PostSwiper extends Swiper {
  public data = input<IPostLite[]>()

  public constructor() {
    super()
  }

  protected override get maxIndex(): number {
    return 2
  }
}
