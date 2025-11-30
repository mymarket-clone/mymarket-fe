import { AbstractControl, ValidationErrors } from '@angular/forms'

export function birthYearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toString().trim()

  if (!value) return null

  const year = Number(value)
  const isValid = /^\d{4}$/.test(value) && year >= 1900 && year <= 2025

  return isValid ? null : { birthYear: true }
}
