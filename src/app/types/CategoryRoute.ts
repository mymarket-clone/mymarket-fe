export type CategoryRoute = {
  link: string[]
  queryParams?: Record<string, string | number | boolean>
}

export type HomeCategoryCard = {
  id: number
  name: string
  logoUrl: string | null
  route: CategoryRoute
  variant: 'api' | 'all' | 'installments' | 'discount'
}

export type HomeCategoryLayoutItem =
  | { type: 'special'; key: 'all' | 'installments' | 'discount' }
  | { type: 'api-order'; order: number }
  | { type: 'rest' }
