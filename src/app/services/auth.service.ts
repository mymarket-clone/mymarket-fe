import { Injectable } from '@angular/core'
import { HttpService } from '../shared/services/http.service'
import { HttpMethod } from '../types/HttpMethod'
import { ILoginUser } from '../interfaces/response/ILoginUser'
import { IHttpService } from '../interfaces/common/IHttpService'
import { LoginCredentials } from '../interfaces/payload/LoginCredentials'
import { ServiceRequest } from '../interfaces/common/ServiceRequest'
import { loginUser, registerUser } from '../api/api'
import { RegisterCredentials } from '../interfaces/payload/RegisterCredentials'

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService {
  public static loginUser(
    options: ServiceRequest<LoginCredentials, ILoginUser>
  ): IHttpService<ILoginUser> {
    return this.prototype.request({
      method: HttpMethod.POST,
      endpoint: loginUser,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public static registerUser(
    options: ServiceRequest<RegisterCredentials, void>
  ): IHttpService<void> {
    return this.prototype.request({
      method: HttpMethod.POST,
      endpoint: registerUser,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }
}
