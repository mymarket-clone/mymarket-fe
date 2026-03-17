import { HttpMethod } from './../../../../types/enums/HttpMethod'
import { Component } from '@angular/core'
import { ApiService } from '../../../../services/http/api.service'
import { IBrand } from '../../../../interfaces/response/IBrand'
import { IHttpService } from '../../../../interfaces/common/IHttpService'

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.html',
})
export class BrandComponent {
  public brandsState?: IHttpService<IBrand[]>

  public constructor(private readonly apiService: ApiService) {
    this.apiService.request({
      method: HttpMethod.GET,
      endpoint: `brands`,
    })
  }
}
