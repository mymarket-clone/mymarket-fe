import { Component } from '@angular/core'
import { Header } from './components/header/header'

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  imports: [Header],
})
export class Main {}
