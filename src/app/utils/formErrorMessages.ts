import { ValidationErrors } from '@angular/forms'

export const formErrorMessages: Record<string, (err: ValidationErrors) => string> = {
  required: () => 'Required field',
  maxlength: (e) => `Maximum length is ${e['requiredLength']}`,
  email: () => 'Please enter a valid email address',
  pattern: () => 'Invalid format',
  birthYear: () => `You must be 18 years old`,
  userExists: () => 'User with this email already exists',
  minLength: (e) => `Password must be at least ${e['requiredLength']} characters`,
  digit: () => 'Password must contain at least one digit (0-9)',
  lowercase: () => 'Password must contain at least one lowercase letter (a-z)',
  uppercase: () => 'Password must contain at least one uppercase letter (A-Z)',
  specialChar: () => 'Password must contain at least one special character (!@#$%...)',
  passwordMismatch: () => 'Passwords do not match',
  lettersOnly: () => 'Field must contain only letters',
}
