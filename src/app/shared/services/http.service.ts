import { HttpClient } from '@angular/common/http'
import { inject, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpMethod } from '../../types/HttpMethod'
import { HttpRequestOptions } from '../../types/HttpRequestOptions'
import { IHttpService } from '../../interfaces/common/IHttpService'

export abstract class HttpService {
  private readonly httpClient = inject(HttpClient)
  private readonly API_URL = 'https://localhost:7289/api/'

  protected request<DataType, BodyType = undefined>(
    options: HttpRequestOptions<DataType, BodyType>
  ): IHttpService<DataType> {
    const { method, endpoint, body, onSuccess, onError } = options

    const loading = signal(false)
    const error = signal<string | null>(null)
    const data = signal<DataType | null>(null)

    const url = `${this.API_URL}${endpoint}`
    let obs$: Observable<DataType>

    switch (method) {
      case HttpMethod.GET:
        obs$ = this.httpClient.get<DataType>(url)
        break
      case HttpMethod.POST:
        obs$ = this.httpClient.post<DataType>(url, body)
        break
      case HttpMethod.PUT:
        obs$ = this.httpClient.put<DataType>(url, body)
        break
      case HttpMethod.PATCH:
        obs$ = this.httpClient.patch<DataType>(url, body)
        break
      case HttpMethod.DELETE:
        obs$ = this.httpClient.delete<DataType>(url)
        break
    }

    loading.set(true)

    obs$.subscribe({
      next: (response) => {
        data.set(response)
        loading.set(false)
        onSuccess?.(response)
      },
      error: (err) => {
        error.set(err?.message || 'Unknown error')
        loading.set(false)
        onError?.(err)
      },
    })

    return { loading, error, data }
  }
}
