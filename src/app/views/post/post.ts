import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'

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
