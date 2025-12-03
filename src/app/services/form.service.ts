import { Injectable, signal } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'

@Injectable()
export class FormService<T extends { [P in keyof T]: AbstractControl }> {
  private _form!: FormGroup<T>
  private _submitted = signal<boolean>(false)

  public setForm(form: FormGroup<T>): void {
    this._form = form
  }

  public getControl<K extends keyof T>(key: K): T[K] {
    return (this._form.controls as T)[key]
  }

  public get form(): FormGroup<T> {
    return this._form
  }

  public setSubmitted(): void {
    this._submitted.set(true)
    this._form.markAllAsTouched()
  }

  public resetSubmitted(): void {
    this._submitted.set(false)
  }

  public get submitted(): boolean {
    return this._submitted()
  }
}
