import { ConditionType } from '@app/types/enums/ConditionType'
import { CurrencyType } from '@app/types/enums/CurrencyType'
import { PostType } from '@app/types/enums/PostType'
import { PromoType } from '@app/types/enums/PromoType'

export interface IAddPostPayload {
  postType: PostType
  categoryId: string
  conditionType: ConditionType
  images: File[]
  title: string
  description: string
  forDisabledPerson: boolean
  price: number
  currencyType: CurrencyType
  salePercentage: number
  canOfferPrice: boolean
  isNegotiable: boolean
  name: string
  phoneNumber: string
  userId: number
  promoType: PromoType | null
  isColored: boolean
  autoRenewal: boolean
}
