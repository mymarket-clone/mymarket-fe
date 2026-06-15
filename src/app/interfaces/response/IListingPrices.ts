import { ListingServiceType } from '@app/types/enums/ListingServiceType'

export type ListingServicePrice = {
  id: number
  serviceType: ListingServiceType
  fromDay: number
  toDay: number
  pricePerDay: number
  originalPricePerDay: number | null
  isActive: boolean
}

export type ListingPriceCatalog = {
  prices: ListingServicePrice[]
}

export type ListingPriceCalculation = {
  totalPrice: number
  totalOriginalPrice: number
}
