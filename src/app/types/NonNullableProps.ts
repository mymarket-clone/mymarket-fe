import { FormControl } from '@angular/forms'

export type NonNullableProps<T> = {
  [K in keyof T]: T[K] extends FormControl<infer V> ? NonNullable<V> : never
}
