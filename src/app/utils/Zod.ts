import { Injectable } from '@angular/core'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { TranslocoService } from '@jsverse/transloco'
import * as z from 'zod'

@Injectable({ providedIn: 'root' })
export class Zod {
  public constructor(private readonly ts: TranslocoService) {}

  private parser<T>(schema: z.ZodType<T>, skipEmpty: boolean = true): ValidatorFn {
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
        return { invalid: 'Invalid' }
      }
    }
  }

  public required(message: string = this.ts.translate('validators.requiredField')): ValidatorFn {
    const schema = z
      .any()
      .refine(
        (value) =>
          value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === ''),
        { message }
      )
    return this.parser(schema, false)
  }

  public email(message: string = this.ts.translate('validators.email')): ValidatorFn {
    const schema = z.email(message)
    return this.parser(schema)
  }

  public password(): ValidatorFn {
    const schema = z
      .string()
      .min(8, { message: this.ts.translate('validators.passwordLength') })
      .refine((val) => /[0-9]/.test(val), { message: this.ts.translate('validators.passwordDigit') })
      .refine((val) => /[a-z]/.test(val), { message: this.ts.translate('validators.passwordLowercase') })
      .refine((val) => /[A-Z]/.test(val), { message: this.ts.translate('validators.passwordUppercase') })
      .refine((val) => /[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(val), {
        message: this.ts.translate('validators.passwordCharacter'),
      })

    return this.parser(schema)
  }

  public between(min: number, max: number): ValidatorFn {
    const schema = z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(min, { message: this.ts.translate('validators.valueAtLeast') + min })
        .max(max, { message: this.ts.translate('validators.valueAtMost') + max })
    )

    return this.parser(schema)
  }

  public maxLength(
    max: number,
    message: string = this.ts.translate('validators.maxLength', { max })
  ): ValidatorFn {
    const schema = z.string().refine((value) => value.length <= max, { message })
    return this.parser(schema)
  }

  public true(): ValidatorFn {
    const schema = z.literal(true, { message: this.ts.translate('validators.requiredField') })
    return this.parser(schema)
  }

  public onlyLetters(message: string): ValidatorFn {
    const schema = z.string().refine((value) => /^[A-Za-z]+$/.test(value), { message })
    return this.parser(schema)
  }

  public length(
    length: number,
    message: string = this.ts.translate('validators.requiredField', { length })
  ): ValidatorFn {
    const schema = z.number().refine((val) => val != length, { message })
    return this.parser(schema)
  }

  public match(
    field1: string,
    field2: string,
    message: string = this.ts.translate('validators.noMatch')
  ): ValidatorFn {
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
