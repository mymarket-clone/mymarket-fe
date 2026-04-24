import { CurrencyType } from '@app/types/enums/CurrencyType'

export interface IPostLite {
  id: number
  title: string
  price: number
  priceAfterDiscount: number
  currencyType: CurrencyType
  isNegotiable: boolean
  images: string[] | null
  isFavorite: boolean
}
