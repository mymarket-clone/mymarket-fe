import { HomeCategoryLayoutItem } from '@app/types/CategoryRoute'

export const HOME_CATEGORY_LAYOUT: HomeCategoryLayoutItem[] = [
  { type: 'special', key: 'all' },
  { type: 'special', key: 'installments' },
  { type: 'api-order', order: 0 },
  { type: 'api-order', order: 1 },
  { type: 'special', key: 'discount' },
  { type: 'api-order', order: 2 },
  { type: 'rest' },
]
