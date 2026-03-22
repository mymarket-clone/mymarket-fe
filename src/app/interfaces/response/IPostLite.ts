import { CurrencyType } from '../../types/enums/CurrencyType'

export interface IPostLite {
  id: number
  title: string
  price: number
  currencyType: CurrencyType
  images: string[] | null
}
