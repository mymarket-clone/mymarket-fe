import { IPaginatedList } from '../common/IPaginatedResponse'
import { IBreadcrumbItem, IPostDetails } from './IPostDetails'

export type CategoryLite = {
  id: number
  name: number
  count: number
  hasChildren: boolean
}

export interface IPostSearch {
  result: IPaginatedList<IPostDetails[]>
  breadcrumb: IBreadcrumbItem[]
  categories: CategoryLite[]
}
