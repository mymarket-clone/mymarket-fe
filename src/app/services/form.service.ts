import {
  afterNextRender,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
} from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { NonNullableProps } from '../types/NonNullableProps'
import { toSignal } from '@angular/core/rxjs-interop'
import { SubmitHandlers } from '../types/SubmitCallbacks'

@Injectable()
export class FormService<T extends { [P in keyof T]: AbstractControl }> {
  private readonly injector = inject(EnvironmentInjector)
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

  public submit(callbacks: SubmitHandlers): void {
    this.setSubmitted()
    if (this._form.valid) callbacks.onSuccess()
    else {
      console.warn('Invalid form')
      console.info(this._form)
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => {
          callbacks.onFailure?.()
        })
      })
    }
  }

  public getValues(): NonNullableProps<T> {
    return this.form.getRawValue() as NonNullableProps<T>
  }

  public getFormData(): FormData {
    const fd = new FormData()
    const values = this.getValues()

    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === undefined) return

      if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file) => fd.append(key, file))
      } else if (value instanceof File) {
        fd.append(key, value)
      } else if (typeof value === 'object') {
        fd.append(key, JSON.stringify(value))
      } else {
        fd.append(key, String(value))
      }
    })

    return fd
  }
}
