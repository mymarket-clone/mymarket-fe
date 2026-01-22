import { Injectable, Signal, signal } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { NonNullableProps } from '../types/NonNullableProps'
import { toSignal } from '@angular/core/rxjs-interop'

@Injectable()
export class FormService<T extends { [P in keyof T]: AbstractControl }> {
  private _form!: FormGroup<T>
  private _submitted = signal<boolean>(false)

  private controlSignals = new Map<keyof T, Signal<string | number | boolean | null | undefined>>()

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

    Object.keys(form.controls).forEach((key) => {
      const controlKey = key as keyof T
      const control = this.getControl(controlKey)

      if (!this.controlSignals.has(controlKey)) {
        this.controlSignals.set(controlKey, toSignal(control.valueChanges, { initialValue: control.value }))
      }
    })
  }

  public getControlSignal<K extends keyof T>(key: K): Signal<string | number | boolean | null | undefined> {
    return this.controlSignals.get(key)!
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
