import { Component, Inject, signal } from '@angular/core'
import { Swiper } from '@app/components/swiper/swiper'
import { POST_DATA } from '@app/configs/injector-token.config'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { PortalService } from '@app/services/portal.service'
import { TranslocoDirective } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'post-images-modal',
  templateUrl: 'post-images-modal.html',
  imports: [SvgIconComponent, TranslocoDirective],
})
export class PostImagesModal extends Swiper {
  public post = signal<IPostDetails | null>(null)

  protected override get maxIndex(): number {
    return 2
  }

  public constructor(
    @Inject(POST_DATA) public data: { post: IPostDetails },
    private readonly portalService: PortalService
  ) {
    super()

    this.post.set(data.post)
  }

  public closePortal(): void {
    this.portalService.close()
  }
}
