import { HttpMethod } from './../../../../types/enums/HttpMethod'
import { Component } from '@angular/core'
import { ApiService } from '../../../../services/http/api.service'
import { IBrand } from '../../../../interfaces/response/IBrand'
import { IHttpService } from '../../../../interfaces/common/IHttpService'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.html',
})
export class BrandComponent {
  public brandsState?: IHttpService<IBrand[]>

  public constructor(private readonly apiService: ApiService) {
    this.brandsState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: 'brands',
    })
  }
}
