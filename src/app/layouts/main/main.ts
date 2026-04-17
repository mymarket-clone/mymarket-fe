import { Component } from '@angular/core'
import { Header } from './components/header/header'
import { RouterOutlet } from '@angular/router'
import { Navbar } from './components/navbar/navbar'
import { Footer } from './components/footer/footer'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.html',
  imports: [Header, RouterOutlet, Footer, Navbar],
})
export class MainLayout {}
