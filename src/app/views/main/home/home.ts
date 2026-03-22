import { Component } from '@angular/core'
import { BrandComponent } from './brands/brands'
import { Categories } from './categories/categories'
import { ApiService } from '../../../services/http/api.service'
import { IHttpService } from '../../../interfaces/common/IHttpService'
import { HttpMethod } from '../../../types/enums/HttpMethod'
import { PostSwiper } from './post-swiper/post-swiper'
import { IPostLiteList } from '../../../interfaces/response/IPostLiteList'

@Component({
  selector: 'app-home',
  imports: [BrandComponent, Categories, PostSwiper],
  templateUrl: './home.html',
})
export class HomeComponent {
  public postsState!: IHttpService<IPostLiteList>

  public constructor(private readonly apiService: ApiService) {
    this.postsState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: 'posts/lite',
    })
  }
}
