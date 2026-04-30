import { CurrencyType } from '@app/types/enums/CurrencyType'

export interface IMyPostItem {
  id: number
  title: string
  price: number
  imageUrl: string
  viewCount: string
  createdAt: string
  status: string
  currencyType: CurrencyType
  isNegotiable: boolean
  priceAfterDiscount?: number
  viewsCount: number
}
