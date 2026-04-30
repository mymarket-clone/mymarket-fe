import { PostStatus } from './enums/PostStatus'

export interface StatusMeta {
  status: PostStatus
  label: string
  icon: string
  count: number
}
