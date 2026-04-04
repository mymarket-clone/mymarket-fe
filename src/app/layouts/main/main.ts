import { Component } from '@angular/core'
import { Header } from './components/header/header'
import { RouterOutlet } from '@angular/router'
import { Footer } from '../../views/footer/footer'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.html',
  imports: [Header, RouterOutlet, Footer],
})
export class MainLayout {}
