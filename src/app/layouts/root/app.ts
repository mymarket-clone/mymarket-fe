import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Tooltip } from '../../components/tooltip/tooltip'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tooltip],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
