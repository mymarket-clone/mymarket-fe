import { Component, input } from '@angular/core'
import { UserStore } from '../../../../stores/user.store'
import { SvgIconComponent } from 'angular-svg-icon'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TranslocoDirective } from '@jsverse/transloco'
import { MenuItem } from '../../../../types/MenuItem'

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
  public constructor(public readonly userStore: UserStore) {}
}
