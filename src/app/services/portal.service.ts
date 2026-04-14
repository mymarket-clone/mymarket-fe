/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, signal } from '@angular/core'
import { Portal } from '@angular/cdk/portal'
import { getScrollableElement } from '@app/helpers/getScrollableElement'

@Injectable({ providedIn: 'root' })
export class PortalService {
  public portal = signal<Portal<any> | null>(null)

  private defaultEnter = 'fade-in'
  private defaultLeave = 'fade-out'
  private defaultDuration = 300 - 15

  public open(portal: Portal<any>, enterClass?: string, scrollVisible: boolean = false): void {
    this.portal.set(portal)

    if (!scrollVisible) {
      getScrollableElement()?.classList.add('no-scroll')
    }

    const animClass = enterClass || this.defaultEnter

    setTimeout(() => {
      const portalEl = document.querySelector('.cdk-portal')
      if (portalEl) {
        portalEl.classList.add(animClass)
      }
    }, 0)
  }

  public close(leaveClass?: string, duration?: number): void {
    const portalEl = document.querySelector('.cdk-portal')
    const animClass = leaveClass || this.defaultLeave
    const animDuration = duration ?? this.defaultDuration

    if (portalEl) {
      portalEl.classList.remove(this.defaultEnter)
      portalEl.classList.add(animClass)

      getScrollableElement()?.classList.remove('no-scroll')

      setTimeout(() => this.portal.set(null), animDuration)
    } else {
      this.portal.set(null)
    }
  }
}
