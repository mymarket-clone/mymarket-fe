import { Component } from '@angular/core'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IPostLiteList } from '@app/interfaces/response/IPostLiteList'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { Categories } from './categories/categories'
import { PostSwiper } from './post-swiper/post-swiper'
import { BrandComponent } from './brands/brands'
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
