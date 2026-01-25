import { ConditionType } from '../../types/enums/ConditionType'
import { CurrencyType } from '../../types/enums/CurrencyType'
import { PostType } from '../../types/enums/PostType'
import { PromoType } from '../../types/enums/PromoType'

export interface IAddPostPayload {
  postType: PostType
  categoryId: string
  conditionType: ConditionType
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
