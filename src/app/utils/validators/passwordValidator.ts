import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string
  if (!value) return null

  const errors: ValidationErrors = {}

  if (value.length < 8) {
    errors['minLength'] = { requiredLength: 8, actualLength: value.length }
  }
  if (!/[0-9]/.test(value)) {
    errors['digit'] = true
  }
  if (!/[a-z]/.test(value)) {
    errors['lowercase'] = true
  }
  if (!/[A-Z]/.test(value)) {
    errors['uppercase'] = true
  }
  if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value)) {
    errors['specialChar'] = true
  }

  return Object.keys(errors).length ? errors : null
}
