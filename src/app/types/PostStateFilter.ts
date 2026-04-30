import { PostStatus } from './enums/PostStatus'

export type PostStateFilter = {
  status: PostStatus
  label: string
  icon: string
  amount: number
}
