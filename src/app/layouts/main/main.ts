import { Component } from '@angular/core'
import { Header } from './components/header/header'
import { RouterOutlet } from '@angular/router'
import { Footer } from '@app/views/footer/footer'
import { Navbar } from './components/navbar/navbar'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.html',
  imports: [Header, RouterOutlet, Footer, Navbar],
})
export class MainLayout {}
