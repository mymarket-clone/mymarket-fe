import { ApiService } from '@app/services/http/api.service'
import { Component, computed, DestroyRef, inject } from '@angular/core'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { CategoryLite, IPostSearch } from '@app/interfaces/response/IPostSearch'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective, TranslocoModule } from '@jsverse/transloco'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { SearchPostCard } from './components/search-post-card'
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
  private actR = inject(ActivatedRoute)
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

    this.sf.setForm(
      new FormGroup<ISearchForm>({
        priceFrom: new FormControl(currentParams['priceFrom'] ? Number(currentParams['priceFrom']) : null),
        priceTo: new FormControl(currentParams['priceTo'] ? Number(currentParams['priceTo']) : null),
        offerPrice: new FormControl(currentParams['offerPrice'] === 'true', { nonNullable: true }),
        discount: new FormControl(currentParams['discount'] === 'true', { nonNullable: true }),
        locId: new FormControl(currentParams['locId'] ? Number(currentParams['locId']) : null),
        condType: new FormControl(condType.length ? condType : null),
        postType: new FormControl(null),
        forPsn: new FormControl(currentParams['forPsn'] === 'true', { nonNullable: true }),
      })
    )

    this.sf.listenToFormChange((values) => {
      console.log(values)
      const filtered = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, (v as unknown) === '' ? null : v])
      )

      console.log(filtered)

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

  public condTypes = Object.entries(ConditionType)
    .filter(([_, v]) => typeof v === 'number')
    .map(([key, value]) => ({ label: key, value: value as number }))

  public toggleCondType(value: number): void {
    const control = this.sf.getControl('condType')
    const current = control.value ?? []
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    control.setValue(updated.length ? updated : null)
  }
}
