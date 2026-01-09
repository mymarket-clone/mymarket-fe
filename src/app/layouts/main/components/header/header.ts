import { Component, signal, WritableSignal } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { Router, RouterLink } from '@angular/router'
import { UserStore } from '../../../../stores/user.store'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { NavbarItem } from '../../../../types/NavbarItem'

@Component({
  selector: 'app-header',
  imports: [SvgIconComponent, TranslocoDirective, RouterLink],
  templateUrl: './header.html',
})
export class Header {
  public navbar?: WritableSignal<NavbarItem[] | null>

  public constructor(
    private readonly router: Router,
    private readonly ts: TranslocoService,
    public readonly userStore: UserStore
  ) {
    this.navbar = signal<NavbarItem[]>([
      { label: this.ts.translate('navbar.installments'), key: 'installments', iconPath: null },
      { label: this.ts.translate('navbar.tradeIn'), key: 'tradeIn', iconPath: null },
      { label: this.ts.translate('navbar.shops'), key: 'shops', iconPath: null },
      { label: this.ts.translate('navbar.sale'), key: 'sale', iconPath: 'assets/discount.svg' },
      { label: this.ts.translate('navbar.gift'), key: 'gift', iconPath: 'assets/gift.svg' },
      { label: this.ts.translate('navbar.openShop'), key: 'openShop', iconPath: null },
      { label: this.ts.translate('navbar.help'), key: 'help', iconPath: null },
      { label: this.ts.translate('navbar.contact'), key: 'contact', iconPath: null },
    ])
  }

  public get userJson(): string {
    return JSON.stringify(this.userStore.getUser(), null, 2) ?? 'No user'
  }

  public handleLoginButton(): void {
    if (this.userStore.getUser()) this.userStore.logout()
    else this.router.navigate(['/user/login'])
  }
}
