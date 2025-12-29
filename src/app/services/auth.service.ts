import api from '../api/api'
import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { HttpMethod } from '../types/enums/HttpMethod'
import { IHttpService } from '../interfaces/common/IHttpService'
import { IServiceRequest } from '../interfaces/common/IServiceRequest'
import { ILoginPayload } from '../interfaces/payload/ILoginPayload'
import { ILoginUser } from '../interfaces/response/ILoginUser'
import { ISendEmailVerificationPayload } from '../interfaces/payload/IEmailVerificationPayload'
import { IRegisterPayload } from '../interfaces/payload/IRegisterPayload'
import { IVerifyPasswordCodePayload } from '../interfaces/payload/IVerifyPasswordCodePayload'
import { ISendPasswordRecoveryPayload } from '../interfaces/payload/ISendPasswordRecoveryPayload'
import { IPasswordRecoveryPayload } from '../interfaces/payload/IPasswordRecoveryPayload'
import { catchError, map, Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService {
  public loginUser(options: IServiceRequest<ILoginPayload, ILoginUser>): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.loginUser,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public registerUser(options: IServiceRequest<IRegisterPayload, void>): IHttpService<void> {
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
    options: IServiceRequest<ISendEmailVerificationPayload, void>
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
    options: IServiceRequest<IVerifyPasswordCodePayload, ILoginUser>
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

  public verifyPasswordCode(options: IServiceRequest<IVerifyPasswordCodePayload, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.verifyPasswordCode,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public sendPasswordRecovery(
    options: IServiceRequest<ISendPasswordRecoveryPayload, void>
  ): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.sendPasswordRecovery,
      body: options.body,
      form: options.form,
      onSuccess: options.onSuccess,
      onError: options.onError,
    })
  }

  public passwordRecovery(options: IServiceRequest<IPasswordRecoveryPayload, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.passwordRecovery,
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
