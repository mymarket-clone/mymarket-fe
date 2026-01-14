import { ITreeNode } from '../common/ITreeNode'

export type ICategoryNode = ITreeNode<{
  name: string
  nameEn?: string | null
  nameRu?: string | null
}>
