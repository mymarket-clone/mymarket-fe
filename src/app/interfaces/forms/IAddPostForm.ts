import { FormControl } from '@angular/forms'
import { CurrencyType } from '../../types/enums/CurrencyType'
import { PostType } from '../../types/enums/PostType'
import { PromoType } from '../../types/enums/PromoType'
import { ConditionType } from '../../types/enums/ConditionType'

export interface IAddPostForm {
  postType: FormControl<PostType>
  categoryId: FormControl<string | null>
  conditionType: FormControl<ConditionType>
  images: FormControl<File[] | null>
  mainImage: FormControl<File | null>
  title: FormControl<string | null>
  description: FormControl<string | null>
  titleRu: FormControl<string | null>
  descriptionRu: FormControl<string | null>
  titleEn: FormControl<string | null>
  descriptionEn: FormControl<string | null>
  forDisabledPerson: FormControl<boolean>
  price: FormControl<number | null>
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
