/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  afterNextRender,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { toSignal } from '@angular/core/rxjs-interop'
import { SubmitHandlers } from '../types/SubmitCallbacks'
import { ICategoryAttributeOptions } from '../interfaces/response/ICategoryAttributeOptions'

@Injectable({ providedIn: 'root' })
export class DynamicFormService {
  private readonly injector = inject(EnvironmentInjector)

  private _form!: FormGroup
  private _submitted = signal(false)
  private controlSignals = new Map<string, Signal<string | number | boolean | null | undefined>>()

  public get form(): FormGroup {
    return this._form
  }

  public get submitted(): boolean {
    return this._submitted()
  }

  public buildForm(attributes: ICategoryAttributeOptions[]): FormGroup {
    const group: Record<string, FormControl> = {}

    attributes.forEach((attr) => {
      group[attr.attributeId] = new FormControl(null, attr.isRequired ? [] : [])
    })

    const form = new FormGroup(group)
    this.setForm(form)

    return form
  }

  public setForm(form: FormGroup): void {
    this._form = form

    Object.keys(form.controls).forEach((key) => {
      if (!this.controlSignals.has(key)) {
        const control = form.controls[key]

        const signalInContext = runInInjectionContext(this.injector, () =>
          toSignal(control.valueChanges, { initialValue: control.value })
        )

        this.controlSignals.set(key, signalInContext)
      }
    })
  }

  public getControl(key: string | number): FormControl {
    return this._form.controls[String(key)] as FormControl
  }

  public getControlSignal(name: string): Signal<string | number | boolean | null | undefined> {
    return this.controlSignals.get(name)!
  }

  public setError(name: string, errorMessage: string): void {
    this.getControl(name).setErrors({ set: errorMessage })
  }

  public setSubmitted(): void {
    this._submitted.set(true)
  }

  public resetSubmitted(): void {
    this._submitted.set(false)
  }

  public submit(callbacks: SubmitHandlers): void {
    this.setSubmitted()

    if (this._form.valid) {
      callbacks.onSuccess()
    } else {
      console.warn('Form invalid')
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => callbacks.onFailure?.())
      })
    }
  }

  public getValues(): Record<string, any> {
    return this._form.getRawValue()
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
