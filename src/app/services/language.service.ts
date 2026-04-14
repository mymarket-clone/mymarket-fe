import { Injectable, signal } from '@angular/core'
import { Language } from '@app/types/Language'
import { TranslocoService } from '@jsverse/transloco'

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = signal('lang')

  public constructor(private readonly transloco: TranslocoService) {}

  public init(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY()) as Language | null
    if (saved) this.transloco.setActiveLang(saved)
  }

  public set(lang: Language): void {
    if (this.transloco.getActiveLang() === lang) return
    this.transloco.setActiveLang(lang)
    localStorage.setItem(this.STORAGE_KEY(), lang)
  }

  public get current(): Language {
    return this.transloco.getActiveLang() as Language
  }

  public languages = [
    { code: 'ka', label: 'ქართული' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
  ] as const
}
