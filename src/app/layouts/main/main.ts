import { Component } from '@angular/core'
import { Header } from './components/header/header'

@Component({
  selector: 'app-main',
  imports: [Header],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
