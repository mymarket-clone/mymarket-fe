import { Component, computed, effect, HostListener, input, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { ApiService } from '@app/services/http/api.service'
import { BaseInput } from '@app/shared/components/base-input'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-select',
  templateUrl: 'select.html',
  imports: [SvgIconComponent, ReactiveFormsModule],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class Select extends BaseInput {
  public endpoint = input.required<string>()
  public selectOpen = signal(false)
  public search = signal('')
  public dataState?: IHttpService<{ id: number; name: string }[]>

  public constructor(private readonly apiService: ApiService) {
    super()
    effect(() => {
      const value = this.control().value

      if (value && !this.dataState?.data && !this.selectOpen()) {
        this.dataState = this.apiService.request({
          endpoint: this.endpoint(),
          method: HttpMethod.GET,
        })
      }
    })
  }

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement

    if (!target.closest('app-select')) {
      this.selectOpen.set(false)
    }
  }

  public loadData(): void {
    const next = !this.selectOpen()
    this.selectOpen.set(next)

    if (next && !this.dataState?.data) {
      this.dataState = this.apiService.request({
        endpoint: this.endpoint(),
        method: HttpMethod.GET,
      })
    }
  }

  public onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value

    this.search.set(value)
    this.selectOpen.set(true)

    if (value) {
      this.control().setValue(null)
    }
  }

  public onItemSelect(id: number): void {
    this.control().setValue(id.toString())

    this.search.set('')
    this.selectOpen.set(false)
  }

  public filteredData = computed(() => {
    const data = this.dataState?.data() ?? []
    const search = this.search().toLowerCase()

    if (!search) return data

    return data.filter((x) => x.name.toLowerCase().includes(search))
  })

  public isFiltering = computed(() => this.search().length > 0)

  public get selectedLoc(): string {
    return this.dataState?.data()?.find((x) => x.id == this.control().value)?.name ?? ''
  }
}
