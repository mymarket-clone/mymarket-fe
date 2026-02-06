import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AddAdvertisementService {
  private _mainImage = signal<Blob | null>(null)
  private _title = signal<string | null>(null)

  public set mainImage(v: Blob | null) {
    this._mainImage.set(v)
  }

  public get mainImage(): Blob | null {
    return this._mainImage()
  }

  public get mainImageUrl(): string | null {
    if (!this._mainImage()) return null
    return URL.createObjectURL(this._mainImage()!)
  }

  public set title(v: string | null) {
    this._title.set(v)
  }

  public get title(): string | null {
    return this._title()
  }
}
