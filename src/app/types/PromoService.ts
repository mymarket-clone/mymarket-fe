import { PromoType } from './enums/PromoType'

export type PromoService = {
  type: PromoType
  title: string
  features: string[]
  price: number[]
  iconSrc: string
  bg: string
  color: string
}
