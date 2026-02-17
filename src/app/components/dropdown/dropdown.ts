/* eslint-disable @typescript-eslint/no-explicit-any */
import { output } from '@angular/core'
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
import { DropdownEl, WithName } from '../../types/DropdownEl'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [ReactiveFormsModule, SvgIconComponent],
  styles: [
    `
      .scrollable-area {
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #9ca3af #f1f1f1;
        scroll-padding: 0px;
      }
    `,
  ],
})
export class Dropdown extends BaseInput implements AfterViewInit, OnInit {
  public dataEndpoint = input<keyof ApiService | undefined>(undefined)
  public dataFilter = input<string | number | boolean | null | undefined>(null)
  public dataList = input<unknown[] | null>(null)
  public border = input<boolean>(true)
  public contentWidth = input<boolean>(false)
  public defaultLabel = input<string | null>(null)
  public itemStyle = input<'small' | 'normal'>('normal')
  public triggerParentOnDeepestSelect = output<void>()

  public inputValue = signal<string>('')
  public selecting = signal<boolean>(false)
  public dataState = signal<IHttpService<any> | null>(null)
  public currentData = signal<any | undefined | null>(null)
  public selectedItemRoute = signal<string[] | null>(null)
  public currentLabel = signal<string | undefined>(undefined)

  private dropRootEl = viewChild<ElementRef<HTMLElement>>('dropRootEl')
  private dropMenuEl = viewChild<ElementRef<HTMLElement>>('dropMenuEl')
  private dropEl = viewChild<ElementRef<HTMLInputElement>>('dropEl')

  public constructor(
    private readonly apiService: ApiService,
    private readonly renderer: Renderer2
  ) {
    super()
    effect(() => this.updateCurrentDataFromState())
    effect(() => this.applyDataFilter())
    effect(() => this.syncLabelWithControl())
    effect(() => this.resetSelectionOnFilterChange())
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
      this.triggerParentOnDeepestSelect.emit()
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

    const filteredData = data.filter((c: any) => c.parentId === parentId)
    const finalData =
      this.dataFilter() !== null
        ? filteredData.filter((i: any) => {
            const filter = this.dataFilter()
            const target = filter === 1 || filter === 2 ? 1 : filter === 3 ? 2 : 3
            return i.categoryPostType === target
          })
        : filteredData

    this.currentData.set(finalData)
  }

  public setItem(element: DropdownEl): void {
    this.currentLabel.set(element.name)
    this.control().setValue(element.value ?? (element as WithName).id)
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

  public filterData(data: DropdownEl[], search: string | null): DropdownEl[] {
    if (!search?.trim()) return data
    const query = search.trim().toLowerCase()
    return data.filter((v) => typeof v.name === 'string' && v.name.toLowerCase().includes(query))
  }

  private updateCurrentDataFromState(): void {
    const data = this.dataState()?.data()
    if (data) this.currentData.set(data)
  }

  private applyDataFilter(): void {
    const filter = this.dataFilter()
    const data = this.dataState()?.data()
    if (!data) return

    let targetData = data.filter((c: any) => c.parentId === null)

    if (filter !== null) {
      const target = filter === 1 || filter === 2 ? 1 : filter === 3 ? 2 : 3
      targetData = targetData.filter((i: any) => i.categoryPostType === target)
    }

    this.currentData.set(targetData)
  }

  private syncLabelWithControl(): void {
    const value = this.control()?.value
    const list = this.dataList()
    if (!list) return

    if (value === null || value === undefined) {
      this.currentLabel.set(undefined)
      return
    }

    const match: any = list.find((i: any) => i.value === value)
    if (match) {
      this.currentLabel.set(match.name)
    } else {
      this.currentLabel.set(undefined)
    }
  }

  private resetSelectionOnFilterChange(): void {
    this.dataFilter()

    this.currentLabel.set(undefined)
    this.selectedItemRoute.set(null)
    this.inputValue.set('')

    const el = this.dropEl()?.nativeElement
    if (el) el.value = ''
  }
}
