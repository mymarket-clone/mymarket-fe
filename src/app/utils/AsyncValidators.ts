import { AbstractControl, AsyncValidatorFn } from '@angular/forms'
import { catchError, from, map, of } from 'rxjs'
import { TranslocoService } from '@jsverse/transloco'
import { api, API_URL } from '../api/api'

export const userExistsValidator = (translocoService: TranslocoService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    const email = control.value
    if (!email) return of(null)

    return from(
      fetch(`${API_URL}${api.userExists}/?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      }).then((resp) => resp.status === 204)
    ).pipe(
      map((exists) => (exists ? { set: translocoService.translate('emailAlreadyUsed') } : null)),
      catchError(() => of(null))
    )
  }
}
