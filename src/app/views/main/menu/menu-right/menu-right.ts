import { Component, OnDestroy } from '@angular/core'
import { AddAdvertisementService } from '../../../../services/views/add-advertisement.service'
import { SvgIconComponent } from 'angular-svg-icon'
import { TranslocoDirective } from '@jsverse/transloco'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'app-menu-right',
  templateUrl: 'menu-right.html',
  imports: [SvgIconComponent, NgTemplateOutlet, TranslocoDirective],
})
export class MenuRight implements OnDestroy {
  public constructor(public readonly addAd: AddAdvertisementService) {}

  public ngOnDestroy(): void {
    this.addAd.reset()
  }

  public determineColor(): string {
    switch (this.addAd.selectedService) {
      case 1: {
        return 'rgb(74, 108, 250)'
      }
      case 2: {
        return 'rgb(254, 201, 0)'
      }
      case 3: {
        return 'rgb(255, 100, 31)'
      }
      default: {
        return 'rgb(147, 149, 155)'
      }
    }
  }
}
