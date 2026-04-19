import { Pipe, PipeTransform } from '@angular/core'
import { CurrencyType } from '@app/types/enums/CurrencyType'
import { currencySymbolMap } from '@app/types/maps/currencySymbol.map'

@Pipe({
  name: 'getCurrency',
})
export class GetCurrencyPipe implements PipeTransform {
  public transform(currencyType: CurrencyType): string {
    return currencySymbolMap[currencyType] ?? ''
  }
}
