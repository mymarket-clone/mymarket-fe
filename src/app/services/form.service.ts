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
import { toSignal } from '@angular/core/rxjs-interop'
import { SubmitHandlers } from '@app/types/SubmitCallbacks'
import { NonNullableProps } from '@app/types/NonNullableProps'
import { debounceTime, identity } from 'rxjs'

@Injectable()
export class FormService<T extends { [P in keyof T]: AbstractControl }> {
  private readonly injector = inject(EnvironmentInjector)
  private _form!: FormGroup<T>
  private _submitted = signal<boolean>(false)
  private controlSignals = new Map<keyof T, Signal<string | number | boolean | null | undefined>>()

  public get form(): FormGroup<T> {
    if (!this._form) console.error('Form is not initalized')
    return this._form
  }

  public get submitted(): boolean {
    return this._submitted()
  }

  public getControl<K extends keyof T>(key: K): T[K] {
    return (this._form.controls as T)[key]
  }

  public setControlValue<K extends keyof T>(
    key: K,
    value: T[K] extends AbstractControl<infer V> ? V : never
  ): void {
    this.getControl(key).setValue(value as never)
  }

  public listenToFormChange(callback: (values: NonNullableProps<T>) => void, debouncer?: number): void {
    this._form.valueChanges
      .pipe(debouncer && debouncer > 0 ? debounceTime(debouncer) : identity)
      .subscribe(() => callback(this.getValues()))
  }

  public setForm(form: FormGroup<T>, options?: { debounce?: number }): void {
    this._form = form

    Object.keys(form.controls).forEach((key) => {
      const controlKey = key as keyof T
      const control = this.getControl(controlKey)

      if (!this.controlSignals.has(controlKey)) {
        const stream = options?.debounce
          ? control.valueChanges.pipe(debounceTime(options.debounce))
          : control.valueChanges

        this.controlSignals.set(controlKey, toSignal(stream, { initialValue: control.value }))
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
