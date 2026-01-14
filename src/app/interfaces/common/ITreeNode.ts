export interface ITreeNode<T> {
  id: number
  parentId: number
  data: T
  children?: ITreeNode<T>[]
}
