import { CategoryPostType } from '../../types/enums/CategoryPostType'

export interface ICategoryAttribute {
  id: number
  parentId: number | null
  name: string
  categoryPostType: CategoryPostType
}
