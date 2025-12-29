import { AbstractControl, AsyncValidatorFn } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { catchError, map, of } from 'rxjs'

export const userExistsValidator = (authService: AuthService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value) return of(null)
    return authService.userExistsObservable(control.value).pipe(
      map((exists) => (exists ? { set: 'User with this email already exists' } : null)),
      catchError(() => of(null))
    )
  }
}
