export type WithName = {
  value: number | string | null
  name: string
  labeledProp?: never
  id?: number
  originalId?: number
}

export type WithLabel = {
  value: number | string | null
  name?: never
  labeledProp: string
}

export type DropdownEl = WithName | WithLabel
