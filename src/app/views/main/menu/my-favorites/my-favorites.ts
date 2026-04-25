import { Component } from '@angular/core'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IPaginatedList } from '@app/interfaces/common/IPaginatedResponse'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { SearchPostCardSkeleton } from '@app/views/search/components/search-post-card-skeleton/search-post-card-skeleton'
import { SearchPostCard } from '@app/views/search/components/search-post-card/search-post-card'

@Component({
  selector: 'my-favorites',
  templateUrl: 'my-favorites.html',
  imports: [SearchPostCardSkeleton, SearchPostCard],
})
export class MyFavorites {
  public favoritesState?: IHttpService<IPaginatedList<IPostDetails[]>>

  public constructor(private readonly apiService: ApiService) {
    this.favoritesState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: 'posts/favorite',
    })
  }

  public onFavoriteChange(event: { id: number; value: boolean }): void {
    this.favoritesState?.data.update((state) => {
      if (!state) return state

      return {
        ...state,
        items: event.value ? state.items : state.items.filter((post) => post.id !== event.id),
      }
    })
  }
}
