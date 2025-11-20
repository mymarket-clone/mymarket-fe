import { Injectable } from '@angular/core'
import { HttpService } from '../shared/services/http.service'
import { HttpMethod } from '../types/HttpMethod'
import { ILoginUser } from '../interfaces/response/ILoginUser'
import { IHttpService } from '../interfaces/common/IHttpService'
import { LoginCredentials } from '../interfaces/payload/LoginCredentials'

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService {
  public loginUser({ emailOrPhone, password }: LoginCredentials): IHttpService<ILoginUser> {
    return this.request<ILoginUser, LoginCredentials>({
      method: HttpMethod.POST,
      endpoint: 'auth/LoginUser',
      body: {
        emailOrPhone,
        password,
      },
    })
  }
}
