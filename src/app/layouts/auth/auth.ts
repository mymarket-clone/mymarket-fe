import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, SvgIconComponent],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {}
