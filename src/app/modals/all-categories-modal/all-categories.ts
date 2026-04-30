import { ApiService } from './../../services/http/api.service'
import { Component, computed, signal } from '@angular/core'
import { Router } from '@angular/router'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { ICategory } from '@app/interfaces/response/ICategory'
import { PortalService } from '@app/services/portal.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { TranslocoDirective } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

interface ICategoryNode extends ICategory {
  children: ICategoryNode[]
}

@Component({
  selector: 'all-categories',
  templateUrl: 'all-categories.html',
  imports: [TranslocoDirective, SvgIconComponent],
})
export class AllCategories {
  public allCategoriesState?: IHttpService<ICategory[]>
  public currentCategory = signal<ICategory | null>(null)
  public mobileCategoryStack = signal<ICategoryNode[]>([])

  public constructor(
    private readonly apiService: ApiService,
    private readonly portalService: PortalService,
    private readonly router: Router
  ) {
    this.allCategoriesState = this.apiService.request({
      endpoint: 'categories',
      method: HttpMethod.GET,
      onSuccess: (data) => {
        this.currentCategory.set(data.find((x) => !x.parentId) ?? null)
      },
    })
  }

  private buildTree(categories: ICategory[], rootId: number | null): ICategoryNode[] {
    const map = new Map<number | null, ICategoryNode[]>()

    for (const cat of categories) {
      const node: ICategoryNode = { ...cat, children: [] }
      const parentId = cat.parentId ?? null

      if (!map.has(parentId)) {
        map.set(parentId, [])
      }

      map.get(parentId)!.push(node)
    }

    const attach = (parentId: number | null): ICategoryNode[] => {
      const children = map.get(parentId) || []

      for (const child of children) {
        child.children = attach(child.id)
      }

      return children
    }

    return attach(rootId)
  }

  public closePortal(): void {
    document.querySelector('app-main-layout')?.classList.add('no-scroll')
    this.portalService.close()
  }

  public onHover(category: ICategory): void {
    this.currentCategory.set(category)
  }

  public navigateTo(catId: number): void {
    this.portalService.close()
    this.router.navigate(['search'], {
      queryParams: {
        catId,
      },
    })
  }

  public categoryTree = computed(() => {
    const current = this.currentCategory()
    const categories = this.allCategoriesState?.data?.()

    if (!current || !categories?.length) return []

    return this.buildTree(categories, current.id)
  })

  public parentCategories = computed(() => {
    return this.allCategoriesState?.stableData()?.filter((x) => !x.parentId)
  })

  public mobileCategoryTree = computed(() => {
    const categories = this.allCategoriesState?.stableData?.()
    if (!categories?.length) return []

    return this.buildTree(categories, null)
  })

  public currentMobileCategory = computed(() => this.mobileCategoryStack().at(-1) ?? null)

  public visibleMobileCategories = computed(() => {
    const current = this.currentMobileCategory()
    return current ? current.children : this.mobileCategoryTree()
  })

  public openMobileCategory(category: ICategoryNode): void {
    this.mobileCategoryStack.update((stack) => [...stack, category])
  }

  public goBackMobileCategory(): void {
    this.mobileCategoryStack.update((stack) => stack.slice(0, -1))
  }
}
