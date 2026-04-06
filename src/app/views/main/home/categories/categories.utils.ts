import { IHomeCategory } from '@app/interfaces/response/IHomeCategory'
import { HomeCategoryCard } from '@app/types/CategoryRoute'
import { HOME_CATEGORY_LAYOUT } from './categories.config'

export function mapApiCategory(item: IHomeCategory): HomeCategoryCard {
  return {
    id: item.id,
    name: item.name,
    logoUrl: item.logoUrl,
    variant: 'api',
    route: {
      link: ['/search'],
      queryParams: { catId: item.categoryId },
    },
  }
}

export function buildCategoryCards(
  items: IHomeCategory[],
  specialCards: Record<'all' | 'installments' | 'discount', HomeCategoryCard>
): HomeCategoryCard[] {
  const apiItems = [...items].sort((a, b) => a.order - b.order)
  const usedIds = new Set<number>()
  const result: HomeCategoryCard[] = []

  for (const entry of HOME_CATEGORY_LAYOUT) {
    if (entry.type === 'special') {
      result.push(specialCards[entry.key])
      continue
    }

    if (entry.type === 'api-order') {
      const item = apiItems.find((x) => x.order === entry.order)

      if (item && !usedIds.has(item.id)) {
        usedIds.add(item.id)
        result.push(mapApiCategory(item))
      }

      continue
    }

    result.push(...apiItems.filter((x) => !usedIds.has(x.id)).map(mapApiCategory))
  }

  return result
}

export function chunkItems<T>(items: T[]): T[][] {
  const result: T[][] = []

  for (let i = 0; i < items.length; i += 6) {
    result.push(items.slice(i, i + 6))
  }

  return result
}
