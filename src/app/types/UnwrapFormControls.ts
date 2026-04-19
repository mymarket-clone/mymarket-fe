import { FormControl } from '@angular/forms'

export type UnwrapFormControls<T> = {
  [K in keyof T]: T[K] extends FormControl<infer V> ? Exclude<V, null> | undefined : never
}
