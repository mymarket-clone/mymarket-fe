export type ITreeNode<T> = {
  id: number
  parentId: number
  children?: ITreeNode<T>[]
} & T
