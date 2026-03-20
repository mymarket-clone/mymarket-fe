import { Component, computed } from '@angular/core'
import { ApiService } from '../../../../services/http/api.service'
import { IHttpService } from '../../../../interfaces/common/IHttpService'
import { IHomeCategory } from '../../../../interfaces/response/IHomeCategory'
import { HttpMethod } from '../../../../types/enums/HttpMethod'
import { NgTemplateOutlet } from '@angular/common'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink } from '@angular/router'

type CategoryRoute = {
  link: string[]
  queryParams?: Record<string, string | number | boolean>
}

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.html',
  imports: [NgTemplateOutlet, SvgIconComponent, RouterLink],
})
export class Categories {
  public categoriesState?: IHttpService<IHomeCategory[]>

  public constructor(private readonly apiService: ApiService) {
    this.categoriesState = this.apiService.request({
      endpoint: 'home-categories',
      method: HttpMethod.GET,
    })
  }

  private readonly uniqueCategory: IHomeCategory = {
    id: -1000,
    name: 'უნიკალური',
    logoUrl: '',
    categoryId: -1000,
    order: -1000,
  }

  private readonly hardcodedCategory1: IHomeCategory = {
    id: -1,
    name: 'მეორადი განვადებით',
    logoUrl: 'https://static.my.ge/mymarket/sections/tabs/images/559.jpg?v=1',
    categoryId: -1,
    order: -1,
  }

  private readonly hardcodedCategory2: IHomeCategory = {
    id: -2,
    name: 'ფასდაკლებული',
    logoUrl: 'https://static.my.ge/mymarket/sections/tabs/images/520.jpg?v=1',
    categoryId: -2,
    order: -2,
  }

  public getCategoryRoute(item: IHomeCategory): CategoryRoute {
    switch (item.id) {
      case -1:
        return {
          link: ['/search'],
          queryParams: { installments: 'true' },
        }

      case -2:
        return {
          link: ['/search'],
          queryParams: { discount: 'true' },
        }

      default:
        return {
          link: ['/search'],
          queryParams: { catId: item.categoryId },
        }
    }
  }

  public categoriesWithInserted = computed(() => {
    const items = [...(this.categoriesState?.data() ?? [])].sort((a, b) => a.order - b.order)

    const item0 = items.find((x) => x.order === 0)
    const item1 = items.find((x) => x.order === 1)
    const item2 = items.find((x) => x.order === 2)

    const usedIds = new Set<number>(
      [item0?.id, item1?.id, item2?.id].filter((id): id is number => id != null)
    )

    const rest = items.filter((x) => !usedIds.has(x.id))

    return [
      this.uniqueCategory,
      this.hardcodedCategory1,
      ...(item0 ? [item0] : []),
      ...(item1 ? [item1] : []),
      this.hardcodedCategory2,
      ...(item2 ? [item2] : []),
      ...rest,
    ]
  })

  public groupedCategories = computed(() => {
    const items = this.categoriesWithInserted()
    const result: IHomeCategory[][] = []

    for (let i = 0; i < items.length; i += 6) {
      result.push(items.slice(i, i + 6))
    }

    return result
  })
}
