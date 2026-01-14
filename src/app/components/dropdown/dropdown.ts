import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'
import { ApiService } from '../../services/http/api.service'
import { IHttpService } from '../../interfaces/common/IHttpService'
import { ICategoryFlat } from '../../interfaces/response/ICategoryFlat'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [ReactiveFormsModule, SvgIconComponent],
})
export class Dropdown extends BaseInput implements AfterViewInit, OnInit {
  public dataEndpoint = input.required<keyof ApiService>()

  public selecting = signal<boolean>(false)
  public dataState = signal<IHttpService<ICategoryFlat[]> | null>(null)
  public currentData = signal<ICategoryFlat[] | undefined | null>(null)
  public selectedCategoryRoute = signal<string[] | null>(null)
  public currentLabel = signal<string | null>(null)

  private dropRootEl = viewChild<ElementRef<HTMLElement>>('dropRootEl')
  private dropMenuEl = viewChild<ElementRef<HTMLElement>>('dropMenuEl')

  public constructor(
    private readonly apiService: ApiService,
    private readonly renderer: Renderer2
  ) {
    super()
    effect(() => this.currentData.set(this.dataState()?.data()))
    effect(() => console.log(this.selectedCategoryRoute()))
    effect(() => (this.selecting() ? this.resetDropdown() : undefined))
  }

  public ngOnInit(): void {
    this.dataState.set(this.apiService[this.dataEndpoint()]() as IHttpService<ICategoryFlat[]>)
  }

  public ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const rootEl = this.dropRootEl()?.nativeElement
      const menuEl = this.dropMenuEl()?.nativeElement

      const target = event.target as Node

      if (rootEl?.contains(target) || menuEl?.contains(target)) return

      this.selecting.set(false)
    })
  }

  public goDeepInCategory(id: number): void {
    const data = this.dataState()?.data()
    if (!data) return

    const selectedCategory = data.find((c) => c.id === id)
    if (!selectedCategory) return

    this.selectedCategoryRoute.update((prev) => [...(prev ?? []), selectedCategory.name])
    const children = data.filter((c) => c.parentId === id)

    if (!children.length) {
      this.selecting.set(false)
      this.currentLabel.set(this.selectedCategoryRoute()?.join(' -> ') ?? selectedCategory.name)
      this.currentData.set(
        this.dataState()
          ?.data()
          ?.filter((c) => !c.parentId)
      )
      return
    }

    this.currentData.set(children)
  }

  public goHigherInCategory(): void {
    const data = this.dataState()?.data()
    const route = this.selectedCategoryRoute()

    if (!data || !route || route.length === 0) return

    const newRoute = route.slice(0, -1)
    this.selectedCategoryRoute.set(newRoute.length > 0 ? newRoute : null)

    let parentId: number | null = null

    if (newRoute && newRoute.length > 0) {
      const lastName = newRoute.at(-1)
      const lastCategory = data.find((c) => c.name === lastName)
      parentId = lastCategory?.id ?? null
    }

    this.currentData.set(data.filter((c) => c.parentId === parentId))
  }

  private resetDropdown(): void {
    const data = this.dataState()?.data()
    if (!data) return

    this.currentData.set(data.filter((c) => !c.parentId))
    this.selectedCategoryRoute.set(null)
  }
}
