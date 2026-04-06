import { Component, computed } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink } from '@angular/router'
import { buildCategoryCards, chunkItems } from './categories.utils'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { IHomeCategory } from '@app/interfaces/response/IHomeCategory'
import { Swiper } from '@app/components/swiper/swiper'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { ApiService } from '@app/services/http/api.service'
import { HomeCategoryCard } from '@app/types/CategoryRoute'
import { HttpMethod } from '@app/types/enums/HttpMethod'

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.html',
  imports: [NgTemplateOutlet, SvgIconComponent, RouterLink, TranslocoDirective],
})
export class Categories extends Swiper {
  public categoriesState?: IHttpService<IHomeCategory[]>

  public constructor(
    private readonly apiService: ApiService,
    private readonly ts: TranslocoService
  ) {
    super()
    this.categoriesState = this.apiService.request({
      endpoint: 'home-categories',
      method: HttpMethod.GET,
    })
  }

  protected override get maxIndex(): number {
    return this.groupedCategories().length - 2
  }

  public categoryCards = computed<HomeCategoryCard[]>(() => {
    return buildCategoryCards(this.categoriesState?.data() ?? [], this.specialCards())
  })

  public groupedCategories = computed<HomeCategoryCard[][]>(() => {
    return chunkItems(this.categoryCards())
  })

  private specialCards = computed(() => {
    return {
      all: {
        id: -1000,
        name: this.ts.translate('home.categories.all'),
        logoUrl: '',
        variant: 'all' as const,
        route: {
          link: ['/search'],
          queryParams: {},
        },
      },
      installments: {
        id: -1,
        name: this.ts.translate('home.categories.installments'),
        logoUrl: 'assets/installments.jpg',
        variant: 'installments' as const,
        route: {
          link: ['/search'],
          queryParams: { installments: 'true' },
        },
      },
      discount: {
        id: -2,
        name: this.ts.translate('home.categories.discount'),
        logoUrl: 'assets/discount.jpg',
        variant: 'discount' as const,
        route: {
          link: ['/search'],
          queryParams: { discount: 'true' },
        },
      },
    }
  })
}
