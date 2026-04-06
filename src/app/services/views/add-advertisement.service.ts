import { computed, Injectable, signal } from '@angular/core'
import { PromoType } from '@app/types/enums/PromoType'

@Injectable({ providedIn: 'root' })
export class AddAdvertisementService {
  private _mainImage = signal<Blob | null>(null)
  private _title = signal<string | null>(null)
  private _views = signal<number>(10)
  private _calls = signal<number>(10)
  private _favourites = signal<number>(10)
  private _selectedService = signal<PromoType | null>(null)
  public _colorSelected = signal<boolean>(false)

  public set mainImage(v: Blob | null) {
    this._mainImage.set(v)
  }
  public get mainImage(): Blob | null {
    return this._mainImage()
  }

  public mainImageUrl = computed(() => {
    const file = this._mainImage()
    return file ? URL.createObjectURL(file) : null
  })

  public set title(v: string | null) {
    this._title.set(v)
  }
  public get title(): string | null {
    return this._title()
  }

  public set views(v: number) {
    this._views.set(v)
  }
  public get views(): number {
    return this._views()
  }

  public set calls(v: number) {
    this._calls.set(v)
  }
  public get calls(): number {
    return this._calls()
  }

  public set favourites(v: number) {
    this._favourites.set(v)
  }
  public get favourites(): number {
    return this._favourites()
  }

  public set selectedService(v: PromoType | null) {
    this._selectedService.set(v)
  }
  public get selectedService(): number {
    return this._selectedService() as number
  }

  public set colorSelected(v: boolean) {
    this._colorSelected.set(v)
  }
  public get colorSelected(): boolean {
    return this._colorSelected()
  }

  public readonly calcViews = computed(() => {
    const base = this._views()
    const service = this._selectedService()

    switch (service) {
      case 1:
        return base + (this._colorSelected() ? 32 : 22)
      case 2:
        return base + (this._colorSelected() ? 48.6 : 38.6)
      case 3:
        return base + (this._colorSelected() ? 69.2 : 59.2)
      default:
        return this._colorSelected() ? base + 1.0 : base
    }
  })

  public readonly calcCalls = computed(() => {
    const base = this._views()
    const service = this._selectedService()

    switch (service) {
      case 1:
        return base + (this._colorSelected() ? 6.6 : 5.3)
      case 2:
        return base + (this._colorSelected() ? 14.0 : 12.7)
      case 3:
        return base + (this._colorSelected() ? 32.2 : 30.9)
      default:
        return this._colorSelected() ? base + 0.13 : base
    }
  })

  public readonly calcFavourites = computed(() => {
    const base = this._views()
    const service = this._selectedService()

    switch (service) {
      case 1:
        return base + (this._colorSelected() ? 3.6 : 2.1)
      case 2:
        return base + (this._colorSelected() ? 7.0 : 5.5)
      case 3:
        return base + (this._colorSelected() ? 11.0 : 9.5)
      default:
        return this._colorSelected() ? base + 0.15 : base
    }
  })

  public reset(): void {
    this._mainImage.set(null)
    this._title.set(null)
    this._views.set(10)
    this._calls.set(10)
    this._favourites.set(10)
    this._colorSelected.set(false)
    this._selectedService.set(null)
  }
}
