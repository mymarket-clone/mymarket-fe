import { Position } from './Position'

export type TooltipData<T> = {
  content: T
  x: number
  y: number
  visible: boolean
  isTemplate?: boolean
  position?: Position
}
