import { Component, computed, ElementRef, signal, viewChild } from '@angular/core'
import { ApiService } from '../../../../services/http/api.service'
import { IHttpService } from '../../../../interfaces/common/IHttpService'
import { IHomeCategory } from '../../../../interfaces/response/IHomeCategory'
import { HttpMethod } from '../../../../types/enums/HttpMethod'
import { NgTemplateOutlet } from '@angular/common'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink } from '@angular/router'
import { HomeCategoryCard } from '../../../../types/CategoryRoute'
import { buildCategoryCards, chunkItems } from './categories.utils'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.html',
  imports: [NgTemplateOutlet, SvgIconComponent, RouterLink, TranslocoDirective],
})
export class Categories {
  public slideIndex = signal<number>(0)
  private sliderCont = viewChild<ElementRef<HTMLDivElement>>('sliderCont')

  public categoriesState?: IHttpService<IHomeCategory[]>

  public constructor(
    private readonly apiService: ApiService,
    private readonly ts: TranslocoService
  ) {
    this.categoriesState = this.apiService.request({
      endpoint: 'home-categories',
      method: HttpMethod.GET,
    })
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

  public setIndex(index: number): void {
    const maxIndex = this.groupedCategories().length - 2

    if (index < 0 || index > maxIndex) return

    this.slideIndex.set(index)
    this.scrollToSlide(index)
  }

  public scrollToSlide(index: number): void {
    const container = this.sliderCont()?.nativeElement
    if (!container) return

    const slide = container.querySelector<HTMLElement>(`[slide-index="${index}"]`)
    if (!slide) return

    slide.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }
}
