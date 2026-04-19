import { Injectable } from '@angular/core'
import { CurrencyType } from '@app/types/enums/CurrencyType'

@Injectable({ providedIn: 'root' })
export class Utils {
  public getCurrencySymbol<T extends { currencyType: CurrencyType }>(data: T): string {
    switch (data.currencyType) {
      case CurrencyType.GEL:
        return '₾'
      case CurrencyType.Dollar:
        return '$'
      default:
        return ''
    }
  }
}
