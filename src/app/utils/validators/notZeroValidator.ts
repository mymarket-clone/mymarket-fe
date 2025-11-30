import { AbstractControl } from '@angular/forms'

export function notZeroValidator(control: AbstractControl): {
  notZero: boolean
} | null {
  return control.value === 0 ? { notZero: true } : null
}
