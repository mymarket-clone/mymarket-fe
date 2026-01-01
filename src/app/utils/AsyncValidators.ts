import { AbstractControl, AsyncValidatorFn } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { catchError, map, of } from 'rxjs'
import { TranslocoService } from '@jsverse/transloco'

export const userExistsValidator = (
  authService: AuthService,
  translocoService: TranslocoService
): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value) return of(null)
    return authService.userExistsObservable(control.value).pipe(
      map((exists) => (exists ? { set: translocoService.translate('emailAlreadyUsed') } : null)),
      catchError(() => of(null))
    )
  }
}
