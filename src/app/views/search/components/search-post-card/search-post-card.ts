import { Component, HostBinding, input, output } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Swiper } from '@app/components/swiper/swiper'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { Utils } from '@app/utils/Utils'
import { ConditionType } from '@app/types/enums/ConditionType'
import { MetaMap } from '@app/types/MetaMap'
import { PromoType } from '@app/types/enums/PromoType'
import { ApiService } from '@app/services/http/api.service'
import { UserStore } from '@app/stores/user.store'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { IHttpService } from '@app/interfaces/common/IHttpService'

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

      :host ::ng-deep svg-icon.active svg path {
        fill: white !important;
      }
    `,
  ],
})
export class SearchPostCard extends Swiper {
  public size = input<'card' | 'list'>('card')
  public data = input.required<IPostDetails>()
  public favouriteState?: IHttpService<void>

  public favoriteChange = output<{ id: number; value: boolean }>()

  protected override get maxIndex(): number {
    return this.data().images.length - 1
  }

  public constructor(
    private readonly ts: TranslocoService,
    private readonly apiService: ApiService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    public readonly utils: Utils
  ) {
    super()
  }

  public toggleFavorite(): void {
    if (this.favouriteState?.loading()) return

    if (!this.userStore.accessToken) {
      this.router.navigate(['/user/login'], {
        queryParams: { returnUrl: this.router.url },
      })
      return
    }

    const post = this.data()
    const previousValue = post.isFavorite
    const nextValue = !previousValue

    this.favoriteChange.emit({
      id: post.id,
      value: nextValue,
    })

    const delta = nextValue ? 1 : -1
    this.userStore.setFavorites(delta)

    const method = nextValue ? HttpMethod.POST : HttpMethod.DELETE

    this.favouriteState = this.apiService.request({
      method,
      endpoint: `posts/${post.id}/favorite`,

      onError: () => {
        this.favoriteChange.emit({
          id: post.id,
          value: previousValue,
        })

        this.userStore.setFavorites(-delta)
      },
    })
  }

  @HostBinding('class.list')
  public get isList(): boolean {
    return this.size() === 'list'
  }

  @HostBinding('class.card')
  public get isCard(): boolean {
    return this.size() === 'card'
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
        color: '#FD541A',
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

  public condition(): MetaMap | undefined {
    return this.conditionMap[this.data()?.conditionType as ConditionType] ?? undefined
  }

  public promo(): MetaMap | undefined {
    return this.promoMap[this.data()?.promoType as PromoType] ?? undefined
  }
}
