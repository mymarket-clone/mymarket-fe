import { LayoutService } from '@app/services/layout.service'
import { Component, computed, effect, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { Router, RouterLink } from '@angular/router'
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco'
import { UserStore } from '@app/stores/user.store'
import { InjectElementDirective } from '@app/modules/directives/injectElement.directive'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { UserDetail } from '@app/types/User'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { PortalService } from '@app/services/portal.service'
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal'
import { NavbarItem } from '@app/types/NavbarItem'
import { LanguageService } from '@app/services/language.service'
import { Language } from '@app/types/Language'
import { AllCategories } from '@app/modals/all-categories-modal/all-categories'

@Component({
  selector: 'app-header',
  imports: [SvgIconComponent, TranslocoDirective, RouterLink, InjectElementDirective, TranslocoPipe],
  templateUrl: './header.html',
})
export class Header {
  public headerSitesOpen = signal<boolean>(false)
  public profileDropdownOpen = signal<boolean>(false)
  public currentUserState?: IHttpService<UserDetail>

  public burgerMenu = viewChild.required<TemplateRef<unknown>>('burgerMenu')
  public allCategories = viewChild.required<TemplateRef<unknown>>('allCategories')

  public constructor(
    private readonly ts: TranslocoService,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly vcr: ViewContainerRef,
    private readonly layoutService: LayoutService,
    public readonly languageService: LanguageService,
    public readonly portalService: PortalService,
    public readonly userStore: UserStore
  ) {
    if (userStore.accessToken) {
      this.currentUserState = this.apiService.request({
        endpoint: 'users/current',
        method: HttpMethod.GET,
        onSuccess: (data) => {
          this.userStore.setFavoritesBase(data.favoritesCount)
        },
      })
    }

    effect(() => {
      if (this.layoutService.isDesktop()) this.portalService.close()
    })
  }

  public switchLang(lang: Language): void {
    this.languageService.set(lang)
    window.location.reload()
  }

  public openBurger(): void {
    const portal = new TemplatePortal(this.burgerMenu(), this.vcr)
    this.portalService.open(portal, undefined, true)
  }

  public closeBurger(): void {
    this.portalService.close()
  }

  public openAllCategories(): void {
    const portal = new ComponentPortal(AllCategories, this.vcr)
    this.portalService.open(portal, undefined, false)
  }

  public closeAllCategories(): void {
    this.portalService.close()
  }

  public logout(): void {
    this.currentUserState = undefined
    this.userStore.logout()
    this.closeBurger()
  }

  public isSearchVisible(): boolean {
    return this.router.url !== '/'
  }

  public get userJson(): string {
    return JSON.stringify(this.userStore.getUser(), null, 2) ?? 'No user'
  }

  public handleLoginButton(): void {
    if (this.userStore.getUser()) this.userStore.logout()
    else this.router.navigate(['/user/login'])
  }

  public navigateTo(route: string): void {
    this.router.navigate([route])
    this.portalService.close()
  }

  public platfomLogos = computed(() => {
    return [
      {
        key: 'myauto',
        url: 'https://www.myauto.ge',
        icon: 'assets/header-sites-logos/my-auto.svg',
      },
      {
        key: 'myparts',
        url: 'https://www.myparts.ge',
        icon: 'assets/header-sites-logos/my-parts.svg',
      },
      {
        key: 'mymarket',
        url: 'https://www.mymarket.ge',
        icon: 'assets/header-sites-logos/my-market.svg',
      },
      {
        key: 'myhome',
        url: 'https://www.myhome.ge',
        icon: 'assets/header-sites-logos/my-home.svg',
      },
      {
        key: 'myjobs',
        url: 'https://myjobs.ge',
        icon: 'assets/header-sites-logos/my-jobs.svg',
      },
      {
        key: 'swoop',
        url: 'https://swoop.ge',
        icon: 'assets/header-sites-logos/swoop.svg',
      },
      {
        key: 'tktge',
        url: 'https://tkt.ge',
        icon: 'assets/header-sites-logos/tktge.svg',
      },
      {
        key: 'livo',
        url: 'https://livo.ge',
        icon: 'assets/header-sites-logos/livo.svg',
      },
      {
        key: 'saba',
        url: 'https://saba.com.ge',
        icon: 'assets/header-sites-logos/saba.png',
      },
      {
        key: 'superapp',
        url: 'https://superapp.tnet.ge',
        icon: 'assets/header-sites-logos/superapp.svg',
      },
    ]
  })

  public avatarDropdownItems = computed(() => {
    return [
      {
        label: this.ts.translate('menu.myListing'),
        route: '/menu/my-listing',
      },
      {
        label: this.ts.translate('menu.incomingOffers'),
        route: '/menu/incoming-offers',
      },
      {
        label: this.ts.translate('menu.onlineOrders'),
        route: '/menu/online-orders',
      },
      {
        label: this.ts.translate('menu.myCards'),
        route: '/menu/my-cards',
      },
      {
        label: this.ts.translate('menu.myAuction'),
        route: '/menu/my-auction',
      },
      {
        label: this.ts.translate('menu.myFinances'),
        route: '/menu/my-finances',
      },
      {
        label: this.ts.translate('menu.myOrders'),
        route: '/menu/my-orders',
      },
      {
        label: this.ts.translate('menu.sentOffers'),
        route: '/menu/sent-offers',
      },
      {
        label: this.ts.translate('menu.myAddresses'),
        route: '/menu/my-addresses',
      },
      {
        label: this.ts.translate('menu.myBankAccounts'),
        route: '/menu/my-bank-accounts',
      },
      {
        label: this.ts.translate('menu.editAccount'),
        route: '/menu/edit-account',
      },
    ]
  })

  public navbar = computed((): NavbarItem[] => [
    { label: this.ts.translate('navbar.installments'), key: 'search', iconPath: null },
    { label: this.ts.translate('navbar.shops'), key: 'shops', iconPath: null },
    {
      label: this.ts.translate('navbar.sale'),
      key: 'sale',
      iconPath: 'assets/discount.svg',
    },
    {
      label: this.ts.translate('navbar.giveAway'),
      key: 'give-away',
      iconPath: 'assets/gift.svg',
    },
    { label: this.ts.translate('navbar.openShop'), key: 'open-shop', iconPath: null },
    { label: this.ts.translate('navbar.help'), key: 'help', iconPath: null },
    { label: this.ts.translate('navbar.blog'), key: 'blog', iconPath: null },
    { label: this.ts.translate('navbar.contact'), key: 'contact', iconPath: null },
    { label: this.ts.translate('navbar.sendMessage'), key: 'send-message', iconPath: null },
    { label: this.ts.translate('navbar.requestCall'), key: 'reqeust-call', iconPath: null },
    { label: this.ts.translate('navbar.rate'), key: 'rate', iconPath: null },
    { label: this.ts.translate('navbar.protectPhishing'), key: 'protect-from-phishing', iconPath: null },
    { label: this.ts.translate('navbar.termsAndConditions'), key: 'terms-and-conditions', iconPath: null },
  ])
}
