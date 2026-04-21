import { FormControl } from '@angular/forms'
import { SortTypes } from '@app/types/enums/SortTypes'

export interface ISearchForm {
  sortType: FormControl<SortTypes>
  priceFrom: FormControl<number | null>
  priceTo: FormControl<number | null>
  offerPrice: FormControl<boolean>
  discount: FormControl<boolean>
  locId: FormControl<number | null>
  condType: FormControl<number[] | null>
  postType: FormControl<number | null>
  forPsn: FormControl<boolean | null>
}
