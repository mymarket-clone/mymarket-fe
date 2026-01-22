import { PostType } from '../../types/enums/PostType'

export interface ICategoryFlat {
  id: number
  name: string
  parentId?: number | null
  categoryPostType: PostType
  hasChildren: boolean
}
