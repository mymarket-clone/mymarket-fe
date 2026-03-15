import { HttpClient } from '@angular/common/http'
import { inject, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { IHttpService } from '../../interfaces/common/IHttpService'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { HttpRequestOptions } from '../../types/HttpRequestOptions'
import { API_URL } from '../../api/api'
import qs from 'qs'
import { FormGroup } from '@angular/forms'

export class HttpService {
  protected readonly httpClient = inject(HttpClient)
  protected readonly API_URL = API_URL

  public request<Data, Body = undefined>(options: HttpRequestOptions<Data, Body>): IHttpService<Data> {
    const { method, endpoint, searchParams, body, formData, onSuccess, onError, form } = options

    const loading = signal(false)
    const error = signal<string | null>(null)
    const data = signal<Data | null>(null)

    const query = searchParams ? qs.stringify(searchParams, { skipNulls: true }) : ''
    const url = query ? `${this.API_URL}${endpoint}?${query}` : `${this.API_URL}${endpoint}`

    const normalizedForms: FormGroup[] = form ? (Array.isArray(form) ? form : [form]) : []

    let obs$: Observable<Data>

    const payload = formData ?? body

    switch (method) {
      case HttpMethod.GET:
        obs$ = this.httpClient.get<Data>(url)
        break
      case HttpMethod.POST:
        obs$ = this.httpClient.post<Data>(url, payload)
        break
      case HttpMethod.PUT:
        obs$ = this.httpClient.put<Data>(url, payload)
        break
      case HttpMethod.PATCH:
        obs$ = this.httpClient.patch<Data>(url, payload)
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
        onError?.(serverErrors || 'Unknown error', errors.error)

        if (normalizedForms.length && serverErrors && typeof serverErrors === 'object') {
          Object.entries(serverErrors).forEach(([field, messages]) => {
            const normalizedField = field.charAt(0).toLowerCase() + field.slice(1)

            for (const f of normalizedForms) {
              const control = f.get(normalizedField)
              if (control) {
                control.setErrors({ server: messages })
                break
              }
            }
          })
        }
      },
    })

    return { loading, error, data }
  }
}
