import qs from 'qs'
import { ApiService } from '@app/services/http/api.service'
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { CategoryLite, IPostSearch } from '@app/interfaces/response/IPostSearch'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective, TranslocoModule, TranslocoService } from '@jsverse/transloco'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { SearchPostCard } from './components/search-post-card/search-post-card'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ISearchForm } from '@app/interfaces/forms/ISearchForm'
import { FormService } from '@app/services/form.service'
import { Switch } from '@app/components/switch/switch'
import { SearchFormStore } from '@app/stores/search-form.store'
import { CommonModule, NgTemplateOutlet } from '@angular/common'
import { Select } from '@app/components/select/select'
import { debounceTime, skip } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ConditionType } from '@app/types/enums/ConditionType'
import { PostType } from '@app/types/enums/PostType'
import { SortTypes } from '@app/types/enums/SortTypes'
import { InjectElementDirective } from '@app/modules/directives/injectElement.directive'
import { SearchPostCardSkeleton } from './components/search-post-card-skeleton/search-post-card-skeleton'
import { PortalService } from '@app/services/portal.service'
import { TemplatePortal } from '@angular/cdk/portal'
import { LayoutService } from '@app/services/layout.service'

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  imports: [
    SvgIconComponent,
    TranslocoDirective,
    TranslocoModule,
    RouterLink,
    SearchPostCard,
    ReactiveFormsModule,
    Switch,
    NgTemplateOutlet,
    Select,
    InjectElementDirective,
    CommonModule,
    SearchPostCardSkeleton,
  ],
  providers: [FormService],
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
  private readonly actR = inject(ActivatedRoute)
  private readonly ts = inject(TranslocoService)

  public postsState?: IHttpService<IPostSearch>
  public filter = viewChild.required<TemplateRef<unknown>>('filters')
  public isFirstLoad = signal<boolean>(true)

  public constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    private readonly vcr: ViewContainerRef,
    private readonly layoutService: LayoutService,
    public readonly sf: FormService<ISearchForm>,
    public readonly sfs: SearchFormStore,
    public readonly portalService: PortalService
  ) {
    const currentParams = this.actR.snapshot.queryParams
    const condType = [...(this.actR.snapshot.queryParams['condType'] ?? [])]?.map((x: unknown) => Number(x))
    const forPsn = currentParams['forPsn'] === 'true' ? true : false

    this.sf.setForm(
      new FormGroup<ISearchForm>({
        sortType: new FormControl(
          currentParams['sortType'] ? Number(currentParams['sortType']) : SortTypes.DateAsc,
          { nonNullable: true }
        ),
        priceFrom: new FormControl(currentParams['priceFrom'] ? Number(currentParams['priceFrom']) : null),
        priceTo: new FormControl(currentParams['priceTo'] ? Number(currentParams['priceTo']) : null),
        offerPrice: new FormControl(currentParams['offerPrice'] === 'true', { nonNullable: true }),
        discount: new FormControl(currentParams['discount'] === 'true', { nonNullable: true }),
        locId: new FormControl(currentParams['locId'] ? Number(currentParams['locId']) : null),
        condType: new FormControl(condType.length ? condType : null),
        postType: new FormControl(
          Number(currentParams['postType']) ? Number(currentParams['postType']) : null
        ),
        forPsn: new FormControl(currentParams['forPsn'] ? forPsn : null),
      })
    )

    this.sf.listenToFormChange((values) => {
      const filtered = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, (v as unknown) === '' ? null : v])
      )

      this.router.navigate([], {
        queryParams: filtered,
        queryParamsHandling: 'merge',
      })
    })

    const serialized = qs.stringify(this.actR.snapshot.queryParams, {
      arrayFormat: 'repeat',
    })
    this.postsState = this.apiService.request({
      endpoint: serialized ? `posts?${serialized}` : `posts`,
      method: HttpMethod.GET,
      state: this.postsState,
    })

    this.actR.queryParams
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const serialized = qs.stringify(params, {
          arrayFormat: 'repeat',
        })
        this.postsState = this.apiService.request({
          endpoint: serialized ? `posts?${serialized}` : `posts`,
          method: HttpMethod.GET,
          state: this.postsState,
        })
      })

    effect(() => {
      if (this.layoutService.isDesktop()) this.portalService.close()
    })

    effect(() => {
      if (this.postsState?.stableData()) {
        this.isFirstLoad.set(false)
      }
    })
  }

  public onFavoriteChange(event: { id: number; value: boolean }): void {
    this.postsState?.data.update((state) => {
      if (!state) return state

      return {
        ...state,
        result: {
          ...state.result,
          items: state.result.items.map((post) =>
            post.id === event.id ? { ...post, isFavorite: event.value } : post
          ),
        },
      }
    })
  }

  public get currentCategory(): number {
    return Number(this.actR.snapshot.queryParamMap.get('catId'))
  }

  public categoryTitle(data: IPostSearch | null | undefined): string | null {
    const breadcrumb = data?.breadcrumb
    if (!breadcrumb?.length) return null

    return breadcrumb.at(-1)?.name ?? null
  }

  public categoryMap = computed(() => {
    const map = new Map<number, CategoryLite>()
    this.postsState?.data()?.categories?.forEach((c) => map.set(c.id, c))
    return map
  })

  public navigateBack(): void {
    const breadcrumb = this.postsState?.data()?.breadcrumb

    if (!breadcrumb || breadcrumb.length === 0) {
      this.router.navigate(['/search'], {
        queryParamsHandling: 'merge',
      })
      return
    }

    if (breadcrumb.length === 1) {
      this.router.navigate(['/search'], {
        queryParams: { page: 1, catId: null },
        queryParamsHandling: 'merge',
      })
      return
    }

    const target = breadcrumb.at(-2)

    this.router.navigate(['/search'], {
      queryParams: {
        page: 1,
        catId: target?.id,
      },
      queryParamsHandling: 'merge',
    })
  }

  public openFilters(): void {
    const portal = new TemplatePortal(this.filter(), this.vcr)
    this.portalService.open(portal, undefined, true)
  }

  public closeFilters(): void {
    this.portalService.close()
  }

  public currentSortType = computed(() => {
    return this.sf.getControl('sortType') || SortTypes.DateDesc
  })

  public clearForm(): void {
    this.sf.form.reset()
  }

  public sortMapTypes = computed(() => {
    return {
      [SortTypes.DateDesc]: this.ts.translate('post.sortLabels.dateDesc'),
      [SortTypes.DateAsc]: this.ts.translate('post.sortLabels.dateAsc'),
      [SortTypes.PriceDesc]: this.ts.translate('post.sortLabels.priceDesc'),
      [SortTypes.PriceAsc]: this.ts.translate('post.sortLabels.priceAsc'),
      [SortTypes.ViewsDesc]: this.ts.translate('post.sortLabels.viewsDesc'),
      [SortTypes.ViewsAsc]: this.ts.translate('post.sortLabels.viewsAsc'),
      [SortTypes.WithDiscount]: this.ts.translate('post.sortLabels.withDiscount'),
    }
  })

  public get condTypes(): {
    label: string
    value: number
  }[] {
    return Object.entries(ConditionType)
      .filter(([_, v]) => typeof v === 'number')
      .map(([_, value]) => ({
        label: {
          [ConditionType.Used]: this.ts.translate('addPost.used'),
          [ConditionType.New]: this.ts.translate('addPost.new'),
          [ConditionType.LikeNew]: this.ts.translate('addPost.likeNew'),
          [ConditionType.ForParts]: this.ts.translate('addPost.forParts'),
        }[value as ConditionType],
        value: value as number,
      }))
  }

  public toggleCondType(value: number): void {
    const control = this.sf.getControl('condType')
    const current = control.value ?? []
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    control.setValue(updated.length ? updated : null)
  }

  public get postTypes(): {
    label: string
    value: number | null
  }[] {
    return [
      { label: this.ts.translate('post.all'), value: null },
      ...Object.entries(PostType)
        .filter(([_, v]) => typeof v === 'number')
        .map(([_, value]) => ({
          label: {
            [PostType.Sell]: this.ts.translate('addPost.sell'),
            [PostType.Buy]: this.ts.translate('addPost.buy'),
            [PostType.Rent]: this.ts.translate('addPost.rent'),
            [PostType.Service]: this.ts.translate('addPost.services'),
          }[value as PostType],
          value: value as number,
        })),
    ]
  }

  public togglePostType(value: number | null): void {
    const control = this.sf.getControl('postType')
    control.setValue(control.value === value ? null : value)
  }

  public get psnTypes(): {
    label: string
    value: boolean | null
  }[] {
    return [
      { label: this.ts.translate('post.all'), value: null },
      { label: this.ts.translate('post.yes'), value: true },
      { label: this.ts.translate('post.no'), value: false },
    ]
  }

  public togglePsnType(value: boolean | null): void {
    const control = this.sf.getControl('forPsn')
    control.setValue(control.value === value ? null : value)
  }
}
