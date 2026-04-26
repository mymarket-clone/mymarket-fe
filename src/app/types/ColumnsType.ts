export type ColumnsType<T> = {
  title: string
  dataIndex?: string
  key?: string
  filters?: Array<{
    text: string
    value: string
  }>
  width?: number | string
  render?: (value: unknown, record: T, index: number) => unknown
  sorter?: boolean | ((a: T, b: T) => number)
}
