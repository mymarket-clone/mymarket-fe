import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')
  const confirm = group.get('passwordConfirm')

  if (!password || !confirm) return null

  if (password.value !== confirm.value) {
    confirm.setErrors({ ...confirm.errors, passwordMismatch: true })
    return { passwordMismatch: true }
  } else {
    if (confirm.errors) {
      const { ...rest } = confirm.errors
      confirm.setErrors(Object.keys(rest).length ? rest : null)
    }
  }

  return null
}
