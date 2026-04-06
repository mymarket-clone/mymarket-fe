import { Component, computed } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IHomeCategory } from '@app/interfaces/response/IHomeCategory'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.html',
  imports: [SvgIconComponent, TranslocoDirective, CommonModule, RouterLink],
})
export class Footer {
  public categoriesState?: IHttpService<IHomeCategory[]>

  public constructor(
    private readonly apiService: ApiService,
    private readonly ts: TranslocoService
  ) {
    this.categoriesState = this.apiService.request({
      endpoint: 'home-categories',
      method: HttpMethod.GET,
    })
  }

  public navigation = computed(() => {
    return [
      {
        key: 'addAdvertisement',
        label: this.ts.translate('footer.navigation.addAdvertisement'),
        route: '/menu/add-advertisement',
      },
      {
        key: 'buyOnline',
        label: this.ts.translate('footer.navigation.buyOnline'),
        route: '/buy-online',
      },
      {
        key: 'usedProducts',
        label: this.ts.translate('footer.navigation.usedProducts'),
        route: '/used-products',
      },
      {
        key: 'safetyLanding',
        label: this.ts.translate('footer.navigation.safetyLanding'),
        route: '/safety',
      },
      {
        key: 'shops',
        label: this.ts.translate('footer.navigation.shops'),
        route: '/shops',
      },
      {
        key: 'openShop',
        label: this.ts.translate('footer.navigation.openShop'),
        route: '/open-shop',
      },
    ]
  })

  public help = computed(() => {
    return [
      {
        key: 'faq',
        label: this.ts.translate('footer.help.faq'),
        route: '/faq',
      },
      {
        key: 'contact',
        label: this.ts.translate('footer.help.contact'),
        route: '/contact',
      },
      {
        key: 'mail',
        label: this.ts.translate('footer.help.mail'),
        route: '/mail',
      },
      {
        key: 'feedback',
        label: this.ts.translate('footer.help.feedback'),
        route: '/feedback',
      },
    ]
  })

  public navigationColumns = computed(() => {
    const items = (this.categoriesState?.data() || []).slice(0, 16)

    return [items.slice(0, 6), items.slice(6, 12), items.slice(12, 16)]
  })

  public platfomLogos = computed(() => {
    return [
      {
        key: 'myauto',
        url: 'https://www.myauto.ge',
        icon: 'assets/myauto.svg',
      },
      {
        key: 'myparts',
        url: 'https://www.myparts.ge',
        icon: 'assets/myparts.svg',
      },
      {
        key: 'myhome',
        url: 'https://www.myhome.ge',
        icon: 'assets/myhome.svg',
      },
      {
        key: 'mymarket',
        url: 'https://www.mymarket.ge',
        icon: 'assets/mymarket.svg',
      },
      {
        key: 'myjobs',
        url: 'https://myjobs.ge',
        icon: 'assets/myjobs.svg',
      },
      {
        key: 'superapp',
        url: 'https://superapp.tnet.ge',
        icon: 'assets/superapp.svg',
      },
      {
        key: 'tktge',
        url: 'https://tkt.ge',
        icon: 'assets/tktge.svg',
      },
      {
        key: 'swoop',
        url: 'https://swoop.ge',
        icon: 'assets/swoop.svg',
      },
      {
        key: 'livo',
        url: 'https://livo.ge',
        icon: 'assets/livo.svg',
      },
    ]
  })
}
