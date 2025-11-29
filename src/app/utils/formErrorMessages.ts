import { ValidationErrors } from '@angular/forms'

export const formErrorMessages: Record<string, (err: ValidationErrors) => string> = {
  required: () => 'Required field',
  minlength: (e) => `Minimum length is ${e['requiredLength']}`,
  maxlength: (e) => `Maximum length is ${e['requiredLength']}`,
  email: () => 'Please enter a valid email address',
  pattern: () => 'Invalid format',
}
