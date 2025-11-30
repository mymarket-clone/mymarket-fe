import { Injectable } from '@angular/core'
import { HttpService } from '../shared/services/http.service'
import { HttpMethod } from '../types/enums/HttpMethod'
import { ILoginUser } from '../interfaces/response/ILoginUser'
import { IHttpService } from '../interfaces/common/IHttpService'
import { LoginCredentials } from '../interfaces/payload/LoginCredentials'
import { ServiceRequest } from '../interfaces/common/ServiceRequest'
import { RegisterCredentials } from '../interfaces/payload/RegisterCredentials'
import api from '../api/api'
import { catchError, map, Observable, of } from 'rxjs'
import { SendEmailVerificationCredentials } from '../interfaces/payload/EmailVerificationCredentials'
import { VerifyEmailCodeCredentials } from '../interfaces/payload/VerifyEmailCodeCredentials'

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService {
  public loginUser(
    options: ServiceRequest<LoginCredentials, ILoginUser>
  ): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.loginUser,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public registerUser(options: ServiceRequest<RegisterCredentials, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.registerUser,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public sendEmailVerificationCode(
    options: ServiceRequest<SendEmailVerificationCredentials, void>
  ): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.sendEmailVerificationCode,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public verifyEmailCode(
    options: ServiceRequest<VerifyEmailCodeCredentials, ILoginUser>
  ): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.verifyEmailCode,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public userExistsObservable(email: string): Observable<boolean> {
    return this.httpClient
      .get(`${this.API_URL}${api.userExists}/?email=${email}`, { observe: 'response' })
      .pipe(
        map((resp) => resp.status === 204),
        catchError(() => of(false))
      )
  }
}
