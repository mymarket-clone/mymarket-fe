import { Injectable } from '@angular/core'
import { ApiService } from './http/api.service'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IHomeCategory } from '@app/interfaces/response/IHomeCategory'
import { HttpMethod } from '@app/types/enums/HttpMethod'

@Injectable({ providedIn: 'root' })
export class HomeCategoriesService {
  public categoriesState!: IHttpService<IHomeCategory[]>

  public constructor(private readonly apiService: ApiService) {
    this.categoriesState = this.apiService.request({
      endpoint: 'home-categories',
      method: HttpMethod.GET,
    })
  }

  public get categories(): IHomeCategory[] | null {
    return this.categoriesState.data()
  }
}
