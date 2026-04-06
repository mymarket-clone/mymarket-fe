import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { Observable } from 'rxjs'
import { User } from '@app/types/User'

@Injectable({ providedIn: 'root' })
export class ApiService extends HttpService {
  public refreshUser(options?: { accessToken: string; refreshToken: string }): Observable<User> {
    return this.httpClient.post<User>(`${this.API_URL}auth/refresh-user`, options)
  }
}
