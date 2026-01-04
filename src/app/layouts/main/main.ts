import { Component } from '@angular/core'
import { Header } from './components/header/header'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.html',
  imports: [Header, RouterOutlet],
})
export class MainLayout {}
