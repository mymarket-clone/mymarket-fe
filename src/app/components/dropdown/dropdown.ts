/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { DropdownEl } from '../../types/DropdownEl'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [ReactiveFormsModule, SvgIconComponent],
})
export class Dropdown extends BaseInput implements AfterViewInit, OnInit {
  public dataEndpoint = input<keyof ApiService | undefined>(undefined)
  public dataFilter = input<string | number | boolean | null | undefined>(null)
  public dataList = input<unknown[] | null>(null)
  public border = input<boolean>(true)

  public inputValue = signal<string>('')
  public selecting = signal<boolean>(false)
  public dataState = signal<IHttpService<any> | null>(null)
  public currentData = signal<any | undefined | null>(null)
  public selectedItemRoute = signal<string[] | null>(null)
  public currentLabel = signal<string | null>(null)

  private dropRootEl = viewChild<ElementRef<HTMLElement>>('dropRootEl')
  private dropMenuEl = viewChild<ElementRef<HTMLElement>>('dropMenuEl')
  private dropEl = viewChild<ElementRef<HTMLInputElement>>('dropEl')

  public constructor(
    private readonly apiService: ApiService,
    private readonly renderer: Renderer2
  ) {
    super()
    effect(() => this.currentData.set(this.dataState()?.data()))
    effect(() => {
      const filter = this.dataFilter()
      const data = this.dataState()?.data()

      if (!data) return

      if (filter === null) {
        this.currentData.set(data)
        return
      }

      const target = filter === 1 || filter === 2 ? 1 : filter === 3 ? 2 : 3

      this.currentData.set(data.filter((i: any) => i.categoryPostType === target))
    })
    effect(() => {
      const value = this.control()?.value
      const list = this.dataList()

      if (!value || !list || this.currentLabel()) return

      const match: any = list.find((i: any) => i.id === value)
      if (match) this.currentLabel.set(match.name)
    })
  }

  public ngOnInit(): void {
    if (!this.currentLabel()?.length && this.dataEndpoint()) {
      this.dataState.set(this.apiService[this.dataEndpoint()!]() as IHttpService<ICategoryFlat[]>)
    }
  }

  public ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const rootEl = this.dropRootEl()?.nativeElement
      const menuEl = this.dropMenuEl()?.nativeElement

      const target = event.target as Node

      if (!rootEl?.contains(target) && !menuEl?.contains(target)) {
        this.selecting.set(false)
        this.inputValue.set('')
        this.dropEl()!.nativeElement.value = ''
      }
    })
  }

  public goDeepInCategory(id: number): void {
    const data = this.dataState()?.data()
    if (!data) return

    const selectedCategory = data.find((c: any) => c.id === id)
    if (!selectedCategory) return

    this.selectedItemRoute.update((prev) => [...(prev ?? []), selectedCategory.name])
    const children = data.filter((c: any) => c.parentId === id)

    if (!children.length) {
      this.selecting.set(false)
      this.currentLabel.set(this.selectedItemRoute()?.join(' -> ') ?? selectedCategory.name)

      this.control().setValue(selectedCategory.id)
      return
    }

    this.currentData.set(children)
  }

  public goHigherInCategory(): void {
    const data = this.dataState()?.data()
    const route = this.selectedItemRoute()

    if (!data || !route || route.length === 0) return

    const newRoute = route.slice(0, -1)
    this.selectedItemRoute.set(newRoute.length > 0 ? newRoute : null)

    let parentId: number | null = null

    if (newRoute && newRoute.length > 0) {
      const lastName = newRoute.at(-1)
      const lastCategory = data.find((c: any) => c.name === lastName)
      parentId = lastCategory?.id ?? null
    }

    this.currentData.set(data.filter((c: any) => c.parentId === parentId))
  }

  public setItem(value: any): void {
    this.currentLabel.set(value.name)
    this.control().setValue(value.id)
    this.selecting.set(false)
    this.inputValue.set('')
    this.dropEl()!.nativeElement.value = ''
  }

  public onDropdownOpen(): void {
    this.selecting.set(true)
    if (this.currentLabel()?.length && this.selectedItemRoute()?.length !== 0) {
      this.selectedItemRoute()?.pop()
    }
  }

  public filterData(data: DropdownEl[], search: string): DropdownEl[] {
    return data.filter((v) => v.name.trim().toLowerCase().includes(search.trim().toLowerCase()))
  }
}
