import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MenuItem } from '@app/types/MenuItem'
import { TranslocoDirective } from '@jsverse/transloco'

@Component({
  selector: 'app-menu-title',
  templateUrl: './menu-title.html',
  imports: [RouterLink, TranslocoDirective],
})
export class MenuTitle {
  public menuItem = input.required<MenuItem>()

  public constructor() {}
}
