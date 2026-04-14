import { Component, computed, signal } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { HomeCategoriesService } from '@app/services/home-categories.service'
import { InjectElementDirective } from '@app/modules/directives/injectElement.directive'
import { LanguageService } from '@app/services/language.service'
import { Language } from '@app/types/Language'

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.html',
  imports: [
    SvgIconComponent,
    TranslocoDirective,
    CommonModule,
    RouterLink,
    InjectElementDirective,
    TranslocoPipe,
  ],
})
export class Footer {
  public languageSwitcherOpen = signal<boolean>(false)

  public constructor(
    private readonly ts: TranslocoService,
    private readonly homeCategories: HomeCategoriesService,
    public readonly languageService: LanguageService
  ) {}

  public switchLang(lang: Language): void {
    this.languageService.set(lang)
    window.location.reload()
  }

  private sectionStates: Record<number, ReturnType<typeof signal<boolean>>> = {
    1: signal(false),
    2: signal(false),
    3: signal(false),
    4: signal(false),
  }

  public toggleFooterSection(index: number): void {
    const state = this.sectionStates[index]
    if (state) {
      state.set(!state())
    }
  }

  public isFooterSectionOpen(index: number): boolean {
    const state = this.sectionStates[index]
    return state ? state() : false
  }

  public navigation = computed(() => {
    return [
      {
        label: this.ts.translate('footer.navigation.addAdvertisement'),
        route: '/menu/add-advertisement',
      },
      {
        label: this.ts.translate('footer.navigation.buyOnline'),
        route: '/buy-online',
      },
      {
        label: this.ts.translate('footer.navigation.usedProducts'),
        route: '/used-products',
      },
      {
        label: this.ts.translate('footer.navigation.safetyLanding'),
        route: '/safety',
      },
      {
        label: this.ts.translate('footer.navigation.shops'),
        route: '/shops',
      },
      {
        label: this.ts.translate('footer.navigation.openShop'),
        route: '/open-shop',
      },
    ]
  })

  public help = computed(() => {
    return [
      {
        label: this.ts.translate('footer.help.faq'),
        route: '/faq',
      },
      {
        label: this.ts.translate('footer.help.contact'),
        route: '/contact',
      },
      {
        label: this.ts.translate('footer.help.feedback'),
        route: '/feedback',
      },
    ]
  })

  public navigationColumns = computed(() => {
    const items = (this.homeCategories.categories || []).slice(0, 16)

    return [items.slice(0, 6), items.slice(6, 12), items.slice(12, 16)]
  })

  public platfomLogos = computed(() => {
    return [
      {
        url: 'https://www.myauto.ge',
        icon: 'assets/footer-sites-logos/my-auto.svg',
      },
      {
        url: 'https://www.myparts.ge',
        icon: 'assets/footer-sites-logos/my-parts.svg',
      },
      {
        url: 'https://www.mymarket.ge',
        icon: 'assets/footer-sites-logos/my-market.svg',
      },
      {
        url: 'https://www.myhome.ge',
        icon: 'assets/footer-sites-logos/my-home.svg',
      },
      {
        url: 'https://myjobs.ge',
        icon: 'assets/footer-sites-logos/my-jobs.svg',
      },
      {
        url: 'https://superapp.tnet.ge',
        icon: 'assets/footer-sites-logos/superapp.svg',
      },
      {
        url: 'https://tkt.ge',
        icon: 'assets/footer-sites-logos/tktge.svg',
      },
      {
        url: 'https://swoop.ge',
        icon: 'assets/footer-sites-logos/swoop.svg',
      },
      {
        url: 'https://livo.ge',
        icon: 'assets/footer-sites-logos/livo.svg',
      },
    ]
  })
}
