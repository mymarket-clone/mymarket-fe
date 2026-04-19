import { CurrencySymbol } from '../CurrencySymbol'
import { CurrencyType } from '../enums/CurrencyType'

export const currencySymbolMap: Record<CurrencyType, CurrencySymbol> = {
  [CurrencyType.GEL]: '₾',
  [CurrencyType.Dollar]: '$',
}
