import { Component, input, ViewContainerRef } from '@angular/core'
import { ComponentPortal } from '@angular/cdk/portal'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TranslocoDirective } from '@jsverse/transloco'
import { UserStore } from '@app/stores/user.store'
import { MenuItem } from '@app/types/MenuItem'
import { PortalService } from '@app/services/portal.service'
import { TopUpBalanceModal } from '@app/modals/top-up-balance-modal/top-up-balance-modal'

@Component({
  selector: 'app-menu-aside',
  templateUrl: './menu-aside.html',
  imports: [SvgIconComponent, RouterLink, RouterLinkActive, TranslocoDirective],
  styles: [
    `
      li {
        cursor: pointer;
      }

      li:hover a {
        color: #fec900 !important;
      }

      li.active a {
        color: #fec900 !important;
      }

      :host ::ng-deep li:hover svg-icon svg path {
        fill: #fec900;
      }

      :host ::ng-deep li:hover svg-icon svg rect {
        fill: #fffbeb;
        transition: all 0.3s ease;
      }

      li a,
      :host ::ng-deep li svg-icon svg path,
      :host ::ng-deep li svg-icon svg rect {
        transition: all 0.3s ease;
      }

      :host ::ng-deep li.active svg-icon svg rect {
        fill: #fffbeb !important;
      }

      :host ::ng-deep li.active svg-icon svg path {
        fill: #fec900;
      }
    `,
  ],
})
export class MenuAside {
  public menuList = input.required<MenuItem[][]>()
  public constructor(
    private readonly portalService: PortalService,
    private readonly vcr: ViewContainerRef,
    public readonly userStore: UserStore
  ) {}

  public openTopUpModal(): void {
    this.portalService.open(new ComponentPortal(TopUpBalanceModal, this.vcr))
  }
}
