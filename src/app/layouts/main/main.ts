import { Component } from '@angular/core'
import { Header } from './components/header/header'
import { RouterOutlet } from '@angular/router'
import { Navbar } from './components/navbar/navbar'
import { Footer } from './components/footer/footer'
import { BottomMenu } from './components/bottom-menu/bottom-menu'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.html',
  imports: [Header, RouterOutlet, Footer, Navbar, BottomMenu],
})
export class MainLayout {}
