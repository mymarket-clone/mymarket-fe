import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IBrand } from '@app/interfaces/response/IBrand'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'

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
