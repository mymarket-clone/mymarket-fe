import { ComponentPortal } from '@angular/cdk/portal'
import { NgTemplateOutlet } from '@angular/common'
import { Component, effect, ElementRef, Injector, signal, viewChild } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Swiper } from '@app/components/swiper/swiper'
import { POST_DATA } from '@app/configs/injector-token.config'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { PostImagesModal } from '@app/modals/post-images-modal/post-images-modal'
import { ApiService } from '@app/services/http/api.service'
import { PortalService } from '@app/services/portal.service'
import { UserStore } from '@app/stores/user.store'
import { AttributeType } from '@app/types/enums/AttributeType'
import { ConditionType } from '@app/types/enums/ConditionType'
import { CurrencyType } from '@app/types/enums/CurrencyType'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { PromoType } from '@app/types/enums/PromoType'
import { MetaMap } from '@app/types/MetaMap'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'post.html',
  templateUrl: 'post.html',
  imports: [RouterLink, TranslocoDirective, SvgIconComponent, NgTemplateOutlet],
  styles: [
    `
      :host ::ng-deep svg-icon.active > svg > rect {
        fill: #fec900 !important;
      }

      :host ::ng-deep svg-icon.active svg path {
        fill: white !important;
      }
    `,
  ],
})
export class Post extends Swiper {
  protected readonly swiperMini = viewChild<ElementRef<HTMLElement>>('swiperMini')
  public copied = signal(false)

  private readonly thumbnailsPerView = 5
  private lastSlideIndex = 0

  public currencyType = CurrencyType
  public attributeType = AttributeType

  public postState?: IHttpService<IPostDetails>
  public phoneNumberState?: IHttpService<string | null>
  public favouriteState?: IHttpService<void>

  protected override get maxIndex(): number {
    const length = this.postState?.data()?.images?.length ?? 0
    return Math.max(length - 1, 1)
  }

  public constructor(
    private readonly ts: TranslocoService,
    private readonly apiService: ApiService,
    private readonly actR: ActivatedRoute,
    private readonly userStore: UserStore,
    private readonly portalService: PortalService
  ) {
    super()
    this.postState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: `posts/${this.actR.snapshot.paramMap.get('id')}`,
      onSuccess: (data) => {
        this.apiService.request({
          method: HttpMethod.GET,
          endpoint: `posts/${data.id}/view`,
        })
      },
    })

    effect(() => this.syncThumbnailSlider())
  }

  public openImages(): void {
    const injector = Injector.create({
      providers: [
        {
          provide: POST_DATA,
          useValue: {
            post: this.postState?.data(),
          },
        },
      ],
    })

    const portal = new ComponentPortal(PostImagesModal, null, injector)
    this.portalService.open(portal, undefined, true)
  }

  public toggleFavorite(): void {
    if (this.favouriteState?.loading()) return

    const post = this.postState?.data()
    if (!post) return

    const previousValue = post.isFavorite
    const nextValue = !previousValue

    this.postState?.data.update((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        isFavorite: nextValue,
      }
    })

    const delta = nextValue ? 1 : -1
    this.userStore.setFavorites(delta)

    const method = nextValue ? HttpMethod.POST : HttpMethod.DELETE

    this.favouriteState = this.apiService.request({
      method,
      endpoint: `posts/${post.id}/favorite`,
      onError: () => {
        this.postState?.data.update((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            isFavorite: previousValue,
          }
        })

        this.userStore.setFavorites(-delta)
      },
    })
  }

  public formatNumber(value: number | string): string {
    const str = value.toString().replace(/\D/g, '')
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  public getCurrencySymbol(): string {
    switch (this.postState?.data()?.currencyType) {
      case CurrencyType.GEL:
        return '₾'
      case CurrencyType.Dollar:
        return '$'
      default:
        return ''
    }
  }

  public copyCurrentUrl(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied.set(true)

      setTimeout(() => {
        this.copied.set(false)
      }, 5000)
    })
  }

  public getOldPrice(): number | null {
    const data = this.postState?.data()
    if (!data?.price || !data.salePercentage) return null

    return data.price / (1 - data.salePercentage / 100)
  }

  public phoneNumber(id: number): void {
    this.phoneNumberState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: `users/${id}/phone-number`,
    })
  }

  public condition(): MetaMap | undefined {
    return this.conditionMap[this.postState?.data()?.conditionType as ConditionType] ?? undefined
  }

  public promo(): MetaMap | undefined {
    return this.promoMap[this.postState?.data()?.promoType as PromoType] ?? undefined
  }

  private get conditionMap(): Partial<Record<ConditionType, MetaMap>> {
    return {
      [ConditionType.Used]: {
        label: this.ts.translate('postDetails.used'),
        color: 'rgb(43 106 222)',
      },
      [ConditionType.New]: {
        label: this.ts.translate('postDetails.new'),
        color: 'rgb(38 183 83)',
      },
      [ConditionType.LikeNew]: {
        label: this.ts.translate('postDetails.likeNew'),
        color: 'rgb(43 106 222)',
      },
    }
  }

  private get promoMap(): Record<PromoType, MetaMap> {
    return {
      [PromoType.SUPER_VIP]: {
        label: 'S-VIP',
        color: 'rgb(253, 65, 0)',
      },
      [PromoType.VIP_PLUS]: {
        label: 'VIP+',
        color: 'rgb(254, 201, 0)',
      },
      [PromoType.VIP]: {
        label: 'VIP',
        color: 'rgb(0, 106, 255)',
      },
    }
  }

  private syncThumbnailSlider(): void {
    const index = this.slideIndex()
    const container = this.swiperMini()?.nativeElement
    if (!container) return

    const slides = Array.from(container.children) as HTMLElement[]
    if (!slides.length) return

    if (index > this.lastSlideIndex) {
      const chunkIndex = Math.floor(index / this.thumbnailsPerView) * this.thumbnailsPerView
      const targetSlide = slides[chunkIndex]
      targetSlide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    } else if (index < this.lastSlideIndex) {
      const targetSlide = slides[index]
      targetSlide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }

    this.lastSlideIndex = index
  }
}
