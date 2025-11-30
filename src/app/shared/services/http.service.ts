import { HttpClient } from '@angular/common/http'
import { inject, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { HttpRequestOptions } from '../../types/HttpRequestOptions'
import { IHttpService } from '../../interfaces/common/IHttpService'
import { FormGroup } from '@angular/forms'

export abstract class HttpService {
  protected readonly httpClient = inject(HttpClient)
  protected readonly API_URL = 'https://localhost:7289/api/'

  protected request<Data, Body = undefined>(
    options: HttpRequestOptions<Data, Body> & { form?: FormGroup }
  ): IHttpService<Data> {
    const { method, endpoint, body, onSuccess, onError, form } = options

    const loading = signal(false)
    const error = signal<string | null>(null)
    const data = signal<Data | null>(null)

    const url = `${this.API_URL}${endpoint}`
    let obs$: Observable<Data>

    switch (method) {
      case HttpMethod.GET:
        obs$ = this.httpClient.get<Data>(url)
        break
      case HttpMethod.POST:
        obs$ = this.httpClient.post<Data>(url, body)
        break
      case HttpMethod.PUT:
        obs$ = this.httpClient.put<Data>(url, body)
        break
      case HttpMethod.PATCH:
        obs$ = this.httpClient.patch<Data>(url, body)
        break
      case HttpMethod.DELETE:
        obs$ = this.httpClient.delete<Data>(url)
        break
    }

    loading.set(true)

    obs$.subscribe({
      next: (response) => {
        data.set(response)
        loading.set(false)
        onSuccess?.(response)
      },
      error: (errors) => {
        const serverErrors = errors.error?.errors || null

        error.set(serverErrors?.[0] || serverErrors || 'Unknown error')
        loading.set(false)
        onError?.(serverErrors || 'Unknown error')

        if (form) {
          Object.entries(serverErrors).forEach(([field, messages]) => {
            const normalizedField = field.charAt(0).toLowerCase() + field.slice(1)
            form.get(normalizedField)?.setErrors({ server: messages })
          })
        }
      },
    })

    return { loading, error, data }
  }
}
