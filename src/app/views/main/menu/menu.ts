import { Component, signal } from '@angular/core'
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'
import { UserStore } from '../../../stores/user.store'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { filter } from 'rxjs'
import { MenuItem } from '../../../types/MenuItem'
import { MenuTitle } from './menu-title/menu-title'
import { MenuAside } from './menu-aside/menu-aside'

@Component({
  selector: 'app-menu',
  imports: [RouterOutlet, TranslocoDirective, MenuTitle, MenuAside],
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
          label: this.ts.translate('menu.myCards'),
          route: '/menu/my-cards',
          iconPath: 'assets/my-cards.svg',
        },
        {
          label: this.ts.translate('menu.myAuction'),
          route: '/menu/my-auction',
          iconPath: 'assets/my-auction.svg',
        },
        {
          label: this.ts.translate('menu.incomingOffers'),
          route: '/menu/incoming-offers',
          iconPath: 'assets/incoming-offers.svg',
        },
        {
          label: this.ts.translate('menu.onlineOrders'),
          route: '/menu/online-orders',
          iconPath: 'assets/online-orders.svg',
        },
        {
          label: this.ts.translate('menu.myFinances'),
          route: '/menu/my-finances',
          iconPath: 'assets/my-finances.svg',
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
          route: '/menu/my-favourites',
          iconPath: 'assets/my-favourites.svg',
        },
        { label: this.ts.translate('menu.myCart'), route: '/menu/my-cart', iconPath: 'assets/my-cart.svg' },
        {
          label: this.ts.translate('menu.myOrders'),
          route: '/menu/my-orders',
          iconPath: 'assets/my-orders.svg',
        },
        {
          label: this.ts.translate('menu.sentOffers'),
          route: '/menu/sent-offers',
          iconPath: 'assets/incoming-offers.svg',
        },
        {
          label: this.ts.translate('menu.myAddresses'),
          route: '/menu/my-addresses',
          iconPath: 'assets/my-addresses.svg',
        },
        {
          label: this.ts.translate('menu.myBankAccounts'),
          route: '/menu/my-bank-accounts',
          iconPath: 'assets/my-bank-accounts.svg',
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
