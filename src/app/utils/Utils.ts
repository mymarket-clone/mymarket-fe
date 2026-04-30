import { DestroyRef, inject, Injectable, Signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { CurrencyType } from '@app/types/enums/CurrencyType'
import { debounceTime, distinctUntilChanged } from 'rxjs'

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
  public debouncedEffect<T>(source: Signal<T>, callback: (value: T) => void, delay = 300): void {
    const destroyRef = inject(DestroyRef)

    toObservable(source)
      .pipe(debounceTime(delay), distinctUntilChanged(), takeUntilDestroyed(destroyRef))
      .subscribe(callback)
  }
}
