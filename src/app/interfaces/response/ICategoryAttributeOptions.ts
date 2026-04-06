import { AttributeType } from '@app/types/enums/AttributeType'

export interface ICategoryAttributeOptions {
  id: number
  categoryId: number
  attributeId: number
  attributeName: string
  attributeType: AttributeType
  unitName: string
  isRequired: boolean
  order: number
  name: string
  options: {
    id: number
    name: string
    order: number
  }[]
}
