import { Injectable } from '@angular/core'
import { HttpService } from '../shared/services/http.service'
import { HttpMethod } from '../types/HttpMethod'
import { ILoginUser } from '../interfaces/response/ILoginUser'
import { IHttpService } from '../interfaces/common/IHttpService'
import { LoginCredentials } from '../interfaces/payload/LoginCredentials'
import { ServiceRequest } from '../interfaces/common/ServiceRequest'

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService {
  public loginUser(
    options: ServiceRequest<LoginCredentials, ILoginUser>
  ): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: 'auth/LoginUser',
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }
}
