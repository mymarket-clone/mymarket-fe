import { Component, signal } from '@angular/core'
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'
import { TranslocoService } from '@jsverse/transloco'
import { filter } from 'rxjs'
import { MenuTitle } from './menu-title/menu-title'
import { MenuAside } from './menu-aside/menu-aside'
import { MenuRight } from './menu-right/menu-right'
import { SvgIconComponent } from 'angular-svg-icon'
import { UserStore } from '@app/stores/user.store'
import { MenuItem } from '@app/types/MenuItem'
import { getScrollableElement } from '@app/helpers/getScrollableElement'

@Component({
  selector: 'app-menu',
  imports: [RouterOutlet, MenuTitle, MenuAside, MenuRight, SvgIconComponent],
  templateUrl: './menu.html',
})
export class Menu {
  public menuList = signal<MenuItem[][] | null>(null)
  public currentMenuItem = signal<MenuItem | null>(null)

  public constructor(
    private readonly ts: TranslocoService,
    private readonly router: Router,
    public readonly userStore: UserStore
  ) {
    this.initMenu()
    this.initCurrentMenuItem()

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.updateCurrentMenuItem()
    })
  }

  public renderRightSide(): boolean {
    return window.location.href.includes('/menu/add-advertisement')
  }

  public scrollToTop(): void {
    getScrollableElement()?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  private updateCurrentMenuItem(): void {
    const menu = this.menuList()
    const active = menu?.flat().find((item) => item.route && this.router.url.startsWith(item.route)) ?? null
    this.currentMenuItem.set(active)
  }

  private initCurrentMenuItem(): void {
    this.currentMenuItem.set(
      this.menuList()
        ?.flat()
        .find((item) => item.route && this.router.url.startsWith(item.route)) ?? null
    )
  }

  private initMenu(): void {
    this.menuList.set([
      [
        {
          label: this.ts.translate('menu.addAdvertisement'),
          route: '/menu/add-advertisement',
          iconPath: 'assets/add-advertisement.svg',
        },
        {
          label: this.ts.translate('menu.myListing'),
          route: '/menu/my-listing',
          iconPath: 'assets/my-listing.svg',
        },
        {
          label: this.ts.translate('menu.myMessages'),
          route: '/menu/my-messages',
          iconPath: 'assets/my-messages.svg',
        },
      ],
      [
        {
          label: this.ts.translate('menu.myFavourites'),
          route: '/menu/my-favorites',
          iconPath: 'assets/my-favourites.svg',
        },
      ],
      [
        {
          label: this.ts.translate('menu.editAccount'),
          route: '/menu/edit-account',
          iconPath: 'assets/edit-account.svg',
        },
        { label: this.ts.translate('menu.logOut'), iconPath: 'assets/logout.svg' },
      ],
    ])
  }
}
