import { Component, computed, TemplateRef, viewChild, ViewContainerRef } from '@angular/core'
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal'
import { NgTemplateOutlet } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { TopUpBalanceModal } from '@app/modals/top-up-balance-modal/top-up-balance-modal'
import { LanguageService } from '@app/services/language.service'
import { PortalService } from '@app/services/portal.service'
import { UserStore } from '@app/stores/user.store'
import { Language } from '@app/types/Language'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

type BottomMenuItem = {
  title: string
  route?: string
  icon: string
  iconClass: string
  exact?: boolean
  badge?: number
}

type ProfileMenuItem = {
  label: string
  icon: string
  route?: string
  action?: 'logout'
}

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.html',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive, SvgIconComponent, TranslocoDirective],
})
export class BottomMenu {
  public profileMenuModal = viewChild<TemplateRef<unknown>>('profileMenuModal')

  public bottomMenu = computed<BottomMenuItem[]>(() => [
    {
      title: 'Home',
      route: '/',
      icon: 'assets/bottom-menu/home.svg',
      iconClass: 'mb-1 h-6 w-6',
      exact: true,
    },
    {
      title: 'Category',
      route: '/search',
      icon: 'assets/bottom-menu/category.svg',
      iconClass: 'mb-1 h-6 w-6',
    },
    {
      title: 'Add',
      route: '/menu/add-advertisement',
      icon: 'assets/bottom-menu/add.svg',
      iconClass: 'mb-1 h-6 w-6',
      exact: true,
    },
    {
      title: 'Favourites',
      route: '/menu/my-favorites',
      icon: 'assets/bottom-menu/favourites.svg',
      iconClass: 'mb-1 h-6 w-6',
    },
    {
      title: 'Profile',
      icon: 'assets/bottom-menu/profile.svg',
      iconClass: 'mb-1 h-[25px] w-[25px]',
      badge: 1,
    },
  ])

  public profileMenuItems = computed<ProfileMenuItem[]>(() => [
    {
      label: this.ts.translate('menu.addAdvertisement'),
      route: '/menu/add-advertisement',
      icon: 'assets/add-advertisement.svg',
    },
    {
      label: this.ts.translate('menu.myListing'),
      route: '/menu/my-listing',
      icon: 'assets/my-listing.svg',
    },
    {
      label: this.ts.translate('menu.myFavourites'),
      route: '/menu/my-favorites',
      icon: 'assets/my-favourites.svg',
    },
    {
      label: this.ts.translate('menu.editAccount'),
      route: '/menu/edit-account',
      icon: 'assets/edit-account.svg',
    },
    {
      label: this.ts.translate('menu.logOut'),
      icon: 'assets/logout.svg',
      action: 'logout',
    },
  ])

  public constructor(
    private readonly portalService: PortalService,
    private readonly router: Router,
    private readonly ts: TranslocoService,
    private readonly vcr: ViewContainerRef,
    public readonly languageService: LanguageService,
    public readonly userStore: UserStore
  ) {}

  public openProfileMenuModal(): void {
    const modal = this.profileMenuModal()
    if (!modal) return

    this.portalService.open(new TemplatePortal(modal, this.vcr))
  }

  public closeProfileMenuModal(): void {
    this.portalService.close()
  }

  public openTopUpBalanceModal(): void {
    this.portalService.open(new ComponentPortal(TopUpBalanceModal, this.vcr))
  }

  public handleProfileMenuItem(item: ProfileMenuItem): void {
    if (item.action === 'logout') {
      this.userStore.logout()
      return
    }

    if (!item.route) return

    this.portalService.close()
    this.router.navigate([item.route])
  }

  public switchLang(lang: Language): void {
    this.languageService.set(lang)
    window.location.reload()
  }
}
