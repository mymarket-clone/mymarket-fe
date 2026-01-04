import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-menu',
  imports: [RouterOutlet, SvgIconComponent],
  templateUrl: './menu.html',
})
export class Menu {}
