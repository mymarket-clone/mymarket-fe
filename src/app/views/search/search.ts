import { ApiService } from '@app/services/http/api.service'
import { Component, computed, effect, inject } from '@angular/core'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { CategoryLite, IPostSearch } from '@app/interfaces/response/IPostSearch'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import qs from 'qs'
import { SearchPostCard } from './components/search-post-card'

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  imports: [SvgIconComponent, TranslocoDirective, RouterLink, SearchPostCard],
  styles: [
    `
      :host {
        display: block;
        background: #f1f3f6;
      }
    `,
  ],
})
export class Search {
  private actR = inject(ActivatedRoute)

  public postsState?: IHttpService<IPostSearch>
  public params = toSignal(this.actR.queryParams, { initialValue: {} })

  public constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {
    effect(() => {
      const params = this.params()
      const hasParams = Object.keys(params).length > 0
      const serializedParams = qs.stringify(params)

      this.postsState = this.apiService.request({
        endpoint: hasParams ? `posts?${serializedParams}` : `posts`,
        method: HttpMethod.GET,
        state: this.postsState,
      })
    })
  }

  public categoryMap = computed(() => {
    const map = new Map<number, CategoryLite>()
    this.postsState?.data()?.categories?.forEach((c) => map.set(c.id, c))
    return map
  })

  public getCurrentCategory(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.params() as any).catId
  }

  public navigateBack(): void {
    const breadcrumb = this.postsState?.data()?.breadcrumb

    if (!breadcrumb || breadcrumb.length === 0) {
      this.router.navigate(['/search'])
      return
    }

    if (breadcrumb.length === 1) {
      this.router.navigate(['/search'], {
        queryParams: { page: 1 },
      })
      return
    }

    const target = breadcrumb.at(-2)

    this.router.navigate(['/search'], {
      queryParams: {
        page: 1,
        catId: target?.id,
      },
    })
  }
}
