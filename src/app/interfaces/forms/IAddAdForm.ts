import { FormControl } from '@angular/forms'
import { CurrencyType } from '../../types/enums/CurrencyType'
import { PostType } from '../../types/enums/PostType'
import { PromoType } from '../../types/enums/PromoType'
import { ConditionType } from '../../types/enums/ConditionType'

export interface IAddAdForm {
  postType: FormControl<PostType>
  categoryId: FormControl<string>
  conditionType: FormControl<ConditionType>
  title: FormControl<string>
  description: FormControl<string>
  forDisabledPerson: FormControl<boolean>
  price: FormControl<number>
  currencyType: FormControl<CurrencyType>
  salePercentage: FormControl<number>
  canOfferPrice: FormControl<boolean>
  isNegotiable: FormControl<boolean>
  name: FormControl<string>
  phoneNumber: FormControl<string>
  userId: FormControl<number>
  promoType: FormControl<PromoType | null>
  isColored: FormControl<boolean>
  autoRenewal: FormControl<boolean>
}
