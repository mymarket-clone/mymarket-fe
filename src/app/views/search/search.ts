import { ApiService } from '@app/services/http/api.service'
import { Component, computed, DestroyRef, inject } from '@angular/core'
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
import { NgTemplateOutlet } from '@angular/common'
import { Select } from '@app/components/select/select'
import qs from 'qs'
import { debounceTime, skip } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ConditionType } from '@app/types/enums/ConditionType'
import { PostType } from '@app/types/enums/PostType'
import { SortTypes } from '@app/types/enums/SortTypes'

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

  public constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    public readonly sf: FormService<ISearchForm>,
    public readonly sfs: SearchFormStore
  ) {
    const currentParams = this.actR.snapshot.queryParams
    const condType = [...(this.actR.snapshot.queryParams['condType'] ?? [])]?.map((x: unknown) => Number(x))
    const forPsn = currentParams['forPsn'] === 'true' ? true : false

    this.sf.setForm(
      new FormGroup<ISearchForm>({
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
  }

  public get currentCategory(): number {
    return Number(this.actR.snapshot.paramMap.get('catId'))
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

  public sortMapTypes = computed(() => {
    return {
      [SortTypes.DateAsc]: this.ts.translate('post.sotLabels.dateAsc'),
      [SortTypes.DateDesc]: this.ts.translate('post.sotLabels.dateDesc'),
      [SortTypes.PriceAsc]: this.ts.translate('post.sotLabels.priceAsc'),
      [SortTypes.PriceDesc]: this.ts.translate('post.sotLabels.priceDesc'),
      [SortTypes.ViewsAsc]: this.ts.translate('post.sotLabels.viewsAsc'),
      [SortTypes.ViewsDesc]: this.ts.translate('post.sotLabels.viewsDesc'),
      [SortTypes.WithDiscount]: this.ts.translate('post.sotLabels.withDiscount'),
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
