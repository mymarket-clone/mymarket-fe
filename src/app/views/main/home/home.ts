import { Component } from '@angular/core'
import { BrandComponent } from './brands/brands'
import { Categories } from './categories/categories'

@Component({
  selector: 'app-home',
  imports: [BrandComponent, Categories],
  templateUrl: './home.html',
})
export class HomeComponent {}
