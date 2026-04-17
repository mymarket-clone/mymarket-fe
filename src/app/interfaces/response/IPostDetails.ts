import { IUserInfo } from './IUserInfo'

export interface IPostDetails {
  id: number
  autoRenewal: boolean
  canOfferPrice: boolean
  categoryId: number
  conditionType: number
  currencyType: number
  description: string
  forDisabledPerson: boolean
  isColored: boolean
  isNegotiable: boolean
  name: string
  phoneNumber: string
  postType: number
  price?: number
  priceAfterDiscount?: number
  promoType: number
  salePercentage: number
  title: string
  city?: string
  breadcrumb: IBreadcrumbItem[]
  attributes: IAttribute[]
  images: string[]
  user: IUserInfo
}

export interface IBreadcrumbItem {
  id: number
  name: string
  hasChildren: boolean
}

export interface IAttribute {
  attribute: string
  value: string | number
  attributeType: number
}
