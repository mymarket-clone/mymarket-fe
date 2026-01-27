import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { IHttpService } from '../../interfaces/common/IHttpService'
import { IServiceRequest } from '../../interfaces/common/IServiceRequest'
import { ILoginPayload } from '../../interfaces/payload/ILoginPayload'
import { ILoginUser } from '../../interfaces/response/ILoginUser'
import { ISendEmailVerificationPayload } from '../../interfaces/payload/IEmailVerificationPayload'
import { IRegisterPayload } from '../../interfaces/payload/IRegisterPayload'
import { IVerifyPasswordCodePayload } from '../../interfaces/payload/IVerifyPasswordCodePayload'
import { ISendPasswordRecoveryPayload } from '../../interfaces/payload/ISendPasswordRecoveryPayload'
import { IPasswordRecoveryPayload } from '../../interfaces/payload/IPasswordRecoveryPayload'
import { api } from '../../api/api'
import { ICategoryNode } from '../../interfaces/response/ICategoryNode'
import { IApiService } from '../../interfaces/common/IApiService'
import { IGetCategoriesFlatPayload } from '../../interfaces/payload/IGetCategoriesFlatPayload'
import { IAddPostPayload } from '../../interfaces/payload/IAddPostPayload'
import { ICity } from '../../interfaces/response/ICity'

@Injectable({ providedIn: 'root' })
export class ApiService extends HttpService implements IApiService {
  public loginUser(options?: IServiceRequest<ILoginPayload, ILoginUser>): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.loginUser,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public registerUser(options?: IServiceRequest<IRegisterPayload, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.registerUser,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public sendEmailVerificationCode(
    options?: IServiceRequest<ISendEmailVerificationPayload, void>
  ): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.sendEmailVerificationCode,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public verifyEmailCode(
    options?: IServiceRequest<IVerifyPasswordCodePayload, ILoginUser>
  ): IHttpService<ILoginUser> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.verifyEmailCode,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public verifyPasswordCode(options?: IServiceRequest<IVerifyPasswordCodePayload, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.verifyPasswordCode,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public sendPasswordRecovery(
    options?: IServiceRequest<ISendPasswordRecoveryPayload, void>
  ): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.sendPasswordRecovery,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public passwordRecovery(options?: IServiceRequest<IPasswordRecoveryPayload, void>): IHttpService<void> {
    return this.request({
      method: HttpMethod.POST,
      endpoint: api.passwordRecovery,
      body: options?.body,
      form: options?.form,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public getCategories(options?: IServiceRequest<void, ICategoryNode[]>): IHttpService<ICategoryNode[]> {
    return this.request({
      method: HttpMethod.GET,
      endpoint: api.getCategories,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public getCategoriesFlat(
    options?: IServiceRequest<IGetCategoriesFlatPayload, ICategoryNode[]>
  ): IHttpService<ICategoryNode[]> {
    return this.request({
      method: HttpMethod.GET,
      searchParams: options?.searchParams,
      endpoint: api.getCategoriesFlat,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public addPost(options?: IServiceRequest<IAddPostPayload, unknown>): IHttpService<unknown> {
    return this.request({
      method: HttpMethod.POST,
      searchParams: options?.searchParams,
      endpoint: api.addPost,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public getAllCities(options?: IServiceRequest<void, ICity[]>): IHttpService<ICity[]> {
    return this.request({
      method: HttpMethod.GET,
      searchParams: options?.searchParams,
      endpoint: api.getAllCities,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }
}
