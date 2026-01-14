export interface ICategoryFlat {
  id: number
  name: string
  parentId?: number | null
  hasChildren: boolean
}
