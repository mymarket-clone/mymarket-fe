import { Injectable, signal } from '@angular/core'
import { SearchFormSections } from '@app/types/SearchFormSections'

@Injectable({ providedIn: 'root' })
export class SearchFormStore {
  public constructor() {
    const values = this.loadFromStorage()

    window.localStorage.setItem('search-form-state', JSON.stringify(values))

    Object.entries(values).forEach(([key, value]) => {
      this.searchFormStates[key as SearchFormSections].set(value)
    })
  }

  private searchFormStates: Record<SearchFormSections, ReturnType<typeof signal<boolean>>> = {
    viewType: signal(false),
    price: signal(true),
    location: signal(false),
    condType: signal(false),
    postType: signal(false),
    forPsn: signal(false),
  }

  private loadFromStorage(): Record<SearchFormSections, boolean> {
    const raw = window.localStorage.getItem('search-form-state')

    const fallback = this.getCurrentValues()

    if (!raw) return fallback

    try {
      const parsed = JSON.parse(raw)

      if (!this.isValidState(parsed)) {
        return fallback
      }

      return parsed
    } catch {
      return fallback
    }
  }

  private isValidState(value: unknown): value is Record<SearchFormSections, boolean> {
    if (!value || typeof value !== 'object') return false

    const obj = value as Record<string, unknown>

    return Object.keys(obj).every((key) => {
      if (!(key in this.searchFormStates)) return false
      return typeof obj[key] === 'boolean'
    })
  }

  private getCurrentValues(): Record<SearchFormSections, boolean> {
    return Object.fromEntries(
      Object.entries(this.searchFormStates).map(([key, signalFn]) => [key, signalFn()])
    ) as Record<SearchFormSections, boolean>
  }

  public toggle(section: SearchFormSections): void {
    const current = this.searchFormStates[section]()
    this.searchFormStates[section].set(!current)

    const values = this.getCurrentValues()
    window.localStorage.setItem('search-form-state', JSON.stringify(values))
  }

  public get(section: SearchFormSections): boolean {
    return this.searchFormStates[section]()
  }
}
