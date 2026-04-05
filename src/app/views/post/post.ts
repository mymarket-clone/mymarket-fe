import { Component } from '@angular/core'
import { ApiService } from '../../services/http/api.service'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'post.html',
  templateUrl: 'post.html',
})
export class Post {
  public constructor(
    private readonly apiService: ApiService,
    private readonly actR: ActivatedRoute
  ) {
    this.apiService.request({
      method: HttpMethod.GET,
      endpoint: `posts/${this.actR.snapshot.paramMap.get('id')}`,
    })
  }
}
