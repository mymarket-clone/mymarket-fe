import { Component, input } from '@angular/core'

@Component({
  selector: 'search-post-card-skeleton',
  templateUrl: 'search-post-card-skeleton.html',
})
export class SearchPostCardSkeleton {
  public size = input<'card' | 'list'>('card')
}
