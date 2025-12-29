import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideAngularSvgIcon } from 'angular-svg-icon'
import { provideHttpClient } from '@angular/common/http'
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAngularSvgIcon(),
    provideQueryClient(new QueryClient()),
  ],
}
