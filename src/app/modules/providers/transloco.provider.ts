import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  isDevMode,
  provideAppInitializer,
  inject,
} from '@angular/core'
import { provideTransloco, translocoConfig, TranslocoService } from '@jsverse/transloco'
import { TranslocoHttpLoader } from '../../common/transcoloHttpLoader'
import { firstValueFrom } from 'rxjs'

export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: translocoConfig({
        availableLangs: ['ka', 'en', 'ru'],
        defaultLang: 'ka',
        fallbackLang: 'ka',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      }),
      loader: TranslocoHttpLoader,
    }),

    provideAppInitializer(() => {
      const transloco = inject(TranslocoService)
      const langs = transloco.getAvailableLangs() as string[]

      return Promise.all(langs.map((lang) => firstValueFrom(transloco.load(lang))))
    }),
  ])
}
