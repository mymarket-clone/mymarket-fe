import { FormControl } from '@angular/forms'
import { CurrencyType } from '../../types/enums/CurrencyType'
import { PostType } from '../../types/enums/PostType'
import { PromoType } from '../../types/enums/PromoType'
import { ConditionType } from '../../types/enums/ConditionType'

export interface IAddPostForm {
  postType: FormControl<PostType>
  categoryId: FormControl<string>
  conditionType: FormControl<ConditionType>
  title: FormControl<string>
  description: FormControl<string>
  titleRu: FormControl<string | null>
  descriptionRu: FormControl<string | null>
  titleEn: FormControl<string | null>
  descriptionEn: FormControl<string | null>
  forDisabledPerson: FormControl<boolean>
  price: FormControl<number>
  currencyType: FormControl<CurrencyType>
  salePercentage: FormControl<number>
  canOfferPrice: FormControl<boolean>
  isNegotiable: FormControl<boolean>
  cityId: FormControl<string | null>
  name: FormControl<string | null>
  phoneNumber: FormControl<string | null>
  userId: FormControl<number | null>
  promoType: FormControl<PromoType | null>
  promoDays: FormControl<number | null>
  isColored: FormControl<boolean>
  colorDays: FormControl<number | null>
  autoRenewal: FormControl<boolean>
  autoRenewalOnceIn: FormControl<number | null>
  autoRenewalAtTime: FormControl<number | null>
}
