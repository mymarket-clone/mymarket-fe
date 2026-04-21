import { BreakpointObserver } from '@angular/cdk/layout'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly breakpointObserver = inject(BreakpointObserver)

  public isDesktop = toSignal(
    this.breakpointObserver.observe(['(min-width: 1024px)']).pipe(map((r) => r.matches)),
    { initialValue: false }
  )
}
