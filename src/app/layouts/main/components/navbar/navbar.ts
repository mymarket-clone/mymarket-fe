import { Component, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NavbarItem } from '@app/types/NavbarItem'
import { TranslocoService } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  imports: [SvgIconComponent, RouterLink],
})
export class Navbar {
  public constructor(private readonly ts: TranslocoService) {}

  public navbar = computed((): NavbarItem[] => [
    { label: this.ts.translate('navbar.installments'), key: 'installments', iconPath: null },
    { label: this.ts.translate('navbar.shops'), key: 'shops', iconPath: null },
    {
      label: this.ts.translate('navbar.sale'),
      key: 'sale',
      iconPath: 'assets/discount.svg',
    },
    {
      label: this.ts.translate('navbar.giveAway'),
      key: 'giveAway',
      iconPath: 'assets/gift.svg',
    },
    { label: this.ts.translate('navbar.openShop'), key: 'openShop', iconPath: null },
    { label: this.ts.translate('navbar.help'), key: 'help', iconPath: null },
    { label: this.ts.translate('navbar.blog'), key: 'blog', iconPath: null },
    { label: this.ts.translate('navbar.contact'), key: 'contact', iconPath: null },
  ])
}
