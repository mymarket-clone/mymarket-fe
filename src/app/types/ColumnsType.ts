import { TemplateRef } from '@angular/core'

export type ColumnsType<T> = {
  title: string
  dataIndex?: string
  key?: string
  template?: TemplateRef<unknown>
  filters?: Array<{
    text: string
    value: string
  }>
  width?: number | string
  render?: (value: unknown, record: T) => unknown
  sorter?: boolean | ((a: T, b: T) => number)
  sortDir?: 'asc' | 'desc'
}
