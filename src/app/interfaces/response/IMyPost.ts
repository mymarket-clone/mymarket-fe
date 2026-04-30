import { IPaginatedList } from '../common/IPaginatedResponse'
import { IMyPostItem } from './IMyPostItem'

export interface IMyPost {
  result: IPaginatedList<IMyPostItem[]>
  activeCount: number
  inactiveCount: number
  blocked: number
  totalViews: number
}
