import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const lettersOnlyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string
  if (!value) return null

  const isValid = /^[A-Za-z]+$/.test(value)

  return isValid ? null : { lettersOnly: true }
}
