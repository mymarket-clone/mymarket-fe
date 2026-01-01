import { Injectable, signal } from '@angular/core'
import { TranslocoService } from '@jsverse/transloco'
import { Language } from '../types/Language'

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = signal('lang')

  public constructor(private readonly transloco: TranslocoService) {}

  public init(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY()) as Language | null
    if (saved) this.transloco.setActiveLang(saved)
  }

  public set(lang: Language): void {
    this.transloco.setActiveLang(lang)
    localStorage.setItem(this.STORAGE_KEY(), lang)
  }

  public get current(): Language {
    return this.transloco.getActiveLang() as Language
  }
}
