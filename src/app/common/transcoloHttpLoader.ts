import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Translation, TranslocoLoader, TranslocoService } from '@jsverse/transloco'
import { firstValueFrom, Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient)

  public getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`../i18n/${lang}.json`)
  }
}

export function preloadTransloco(transloco: TranslocoService): () => Promise<void> {
  return () => firstValueFrom(transloco.load(transloco.getDefaultLang())).then(() => void 0)
}
