import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import * as z from 'zod'

export class Zod {
  private static parser<T>(schema: z.ZodType<T>, skipEmpty: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value

      if (
        skipEmpty &&
        (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))
      ) {
        return null
      }

      try {
        schema.parse(value)
        return null
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errors: ValidationErrors = {}
          err.issues.forEach((issue) => {
            const key = issue.path.join('.') || 'invalid'
            errors[key] = issue.message
          })
          return errors
        }
        return { invalid: 'Invalid value' }
      }
    }
  }

  public static required(message: string = 'Required Field'): ValidatorFn {
    const schema = z
      .any()
      .refine(
        (value) =>
          value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === ''),
        { message }
      )
    return this.parser(schema, false)
  }

  public static email(message: string = 'Please enter a valid email address'): ValidatorFn {
    const schema = z.email(message)
    return this.parser(schema)
  }

  public static password(): ValidatorFn {
    const schema = z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((val) => /[0-9]/.test(val), { message: 'Password must contain at least one digit' })
      .refine((val) => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
      .refine((val) => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
      .refine((val) => /[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(val), {
        message: 'Password must contain at least one special character',
      })

    return this.parser(schema)
  }

  public static between(min: number, max: number): ValidatorFn {
    const schema = z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(min, { message: `Value must be at least ${min}` })
        .max(max, { message: `Value must be at most ${max}` })
    )

    return this.parser(schema)
  }

  public static true(): ValidatorFn {
    const schema = z.literal(true, { message: 'Requred field' })
    return this.parser(schema)
  }

  public static onlyLetters(message: string = 'Field must contain only letters'): ValidatorFn {
    const schema = z.string().refine((value) => /^[A-Za-z]+$/.test(value), { message })
    return this.parser(schema)
  }

  public static length(length: number, message: string = `Length must be ${length} charecters`): ValidatorFn {
    const schema = z.number().refine((val) => val != length, { message })
    return this.parser(schema)
  }

  public static match(field1: string, field2: string, message: string = 'Fields do not match'): ValidatorFn {
    const schema = z
      .object({
        [field1]: z.string(),
        [field2]: z.string(),
      })
      .refine((data) => data[field1] === data[field2], { message, path: [field2] })

    return (group: AbstractControl): ValidationErrors | null => {
      const value = {
        [field1]: group.get(field1)?.value,
        [field2]: group.get(field2)?.value,
      }

      const errors = this.parser(schema)({ value } as AbstractControl)

      const control = group.get(field2)
      if (control) {
        if (errors) {
          control.setErrors({ ...control.errors, passwordMismatch: message })
        } else if (control.errors?.['passwordMismatch']) {
          const { ...rest } = control.errors
          control.setErrors(Object.keys(rest).length ? rest : null)
        }
      }

      return errors ? { passwordMismatch: message } : null
    }
  }
}
