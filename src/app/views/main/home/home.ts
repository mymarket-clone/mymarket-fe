import { Component } from '@angular/core'
import { BrandComponent } from './brands/brands'

@Component({
  selector: 'app-home',
  imports: [BrandComponent],
  templateUrl: './home.html',
})
export class HomeComponent {}
