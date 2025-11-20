import { WritableSignal } from '@angular/core'

export interface IHttpService<DataType> {
  loading: WritableSignal<boolean>
  error: WritableSignal<string | null>
  data: WritableSignal<DataType | null>
}
