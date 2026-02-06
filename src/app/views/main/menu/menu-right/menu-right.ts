import { Component } from '@angular/core'
import { AddAdvertisementService } from '../../../../services/views/add-advertisement.service'

@Component({
  selector: 'app-menu-right',
  templateUrl: 'menu-right.html',
})
export class MenuRight {
  public constructor(public readonly addAd: AddAdvertisementService) {}
}
