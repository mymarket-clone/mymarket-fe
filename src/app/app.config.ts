import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideAngularSvgIcon } from 'angular-svg-icon'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { httpInterceptor } from './modules/interceptors/http.interceptor'
import { provideI18n } from './modules/providers/transloco.provider'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideI18n(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAngularSvgIcon(),
  ],
}
