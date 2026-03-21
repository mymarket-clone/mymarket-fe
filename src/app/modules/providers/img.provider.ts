import { IMAGE_CONFIG } from '@angular/common'
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

export function provideImg(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
      },
    },
  ])
}
