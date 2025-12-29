import { Injectable, signal } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { NonNullableProps } from '../types/NonNullableProps'

@Injectable()
export class FormService<T extends { [P in keyof T]: AbstractControl }> {
  private _form!: FormGroup<T>
  private _submitted = signal<boolean>(false)

  public get form(): FormGroup<T> {
    return this._form
  }

  public get submitted(): boolean {
    return this._submitted()
  }

  public getControl<K extends keyof T>(key: K): T[K] {
    return (this._form.controls as T)[key]
  }

  public setForm(form: FormGroup<T>): void {
    this._form = form
  }

  public setError(control: keyof T, errorMessage: string): void {
    this.getControl(control).setErrors({ set: errorMessage })
  }

  public setSubmitted(): void {
    this._submitted.set(true)
  }

  public resetSubmitted(): void {
    this._submitted.set(false)
  }

  public submit(handler: () => void): void {
    this.setSubmitted()
    if (this._form.valid) handler()
    else console.warn('Invalid form')
  }

  public getValues(): NonNullableProps<T> {
    return this.form.getRawValue() as NonNullableProps<T>
  }
}
