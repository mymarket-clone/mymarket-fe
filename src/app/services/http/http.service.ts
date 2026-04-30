import NProgress from 'nprogress'
import { HttpClient } from '@angular/common/http'
import { inject, signal } from '@angular/core'
import { Observable } from 'rxjs'
import qs from 'qs'
import { FormGroup } from '@angular/forms'
import { API_URL } from '@app/api/api'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { HttpRequestOptions } from '@app/types/HttpRequestOptions'

export class HttpService {
  protected readonly httpClient = inject(HttpClient)
  protected readonly API_URL = API_URL

  public request<Data, Body = undefined>(
    options: HttpRequestOptions<Data, Body> & { state?: IHttpService<Data> }
  ): IHttpService<Data> {
    const { method, endpoint, searchParams, body, formData, onSuccess, onError, onFinally, form } = options

    const loading = options.state?.loading ?? signal(false)
    const error = options.state?.error ?? signal<string | null>(null)
    const data = options.state?.data ?? signal<Data | null>(null)
    const stableData = options.state?.stableData ?? signal<Data | null>(null)

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
    NProgress.configure({ showSpinner: false })
    NProgress.start()

    obs$.subscribe({
      next: (response) => {
        data.set(response)
        stableData.set(response)
        error.set(null)

        loading.set(false)
        NProgress.done(true)
        onSuccess?.(response)
        onFinally?.()
      },
      error: (errors) => {
        const serverErrors = errors.error?.errors || null

        error.set(serverErrors?.[0] || serverErrors || 'Unknown error')
        loading.set(false)
        NProgress.done(true)

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
        onFinally?.()
      },
    })

    return { loading, error, data, stableData }
  }
}
