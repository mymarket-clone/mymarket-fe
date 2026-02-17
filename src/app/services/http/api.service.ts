import { ICategoryAttributeOptions } from './../../interfaces/response/ICategoryAttributeOptions'
import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { IHttpService } from '../../interfaces/common/IHttpService'
import { IServiceRequest } from '../../interfaces/common/IServiceRequest'
import { ILoginPayload } from '../../interfaces/payload/ILoginPayload'
import { ISendEmailVerificationPayload } from '../../interfaces/payload/IEmailVerificationPayload'
import { IRegisterPayload } from '../../interfaces/payload/IRegisterPayload'
import { IVerifyPasswordCodePayload } from '../../interfaces/payload/IVerifyPasswordCodePayload'
import { ISendPasswordRecoveryPayload } from '../../interfaces/payload/ISendPasswordRecoveryPayload'
import { IPasswordRecoveryPayload } from '../../interfaces/payload/IPasswordRecoveryPayload'
import { api } from '../../api/api'
import { ICategoryNode } from '../../interfaces/response/ICategoryNode'
import { IApiService } from '../../interfaces/common/IApiService'
import { IGetCategoriesPayload } from '../../interfaces/payload/IGetCategoriesPayload'
import { IAddPostPayload } from '../../interfaces/payload/IAddPostPayload'
import { ICity } from '../../interfaces/response/ICity'
import { Observable } from 'rxjs'
import { User } from '../../types/User'
import { IGetCategoryAttributeByIdPayload } from '../../interfaces/payload/IGetCategoryAttributeByIdPayload'

@Injectable({ providedIn: 'root' })
export class ApiService extends HttpService implements IApiService {
  public loginUser(options?: IServiceRequest<ILoginPayload, User>): IHttpService<User> {
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

  public verifyEmailCode(options?: IServiceRequest<IVerifyPasswordCodePayload, User>): IHttpService<User> {
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

  public refreshUser(options?: { accessToken: string; refreshToken: string }): Observable<User> {
    return this.httpClient.post<User>(`${this.API_URL}auth/refreshUser`, options)
  }

  public getCategories(
    options?: IServiceRequest<IGetCategoriesPayload, ICategoryNode[]>
  ): IHttpService<ICategoryNode[]> {
    return this.request({
      method: HttpMethod.GET,
      searchParams: options?.searchParams,
      endpoint: api.getCategories,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  public addPost(options?: IServiceRequest<IAddPostPayload, unknown>): IHttpService<unknown> {
    return this.request({
      method: HttpMethod.POST,
      formData: options?.formData,
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

  public getCategoryAttributeById(
    options?: IServiceRequest<IGetCategoryAttributeByIdPayload, ICategoryAttributeOptions[]>
  ): IHttpService<ICategoryAttributeOptions[]> {
    return this.request({
      method: HttpMethod.GET,
      searchParams: options?.searchParams,
      endpoint: api.getCategoryAttributeById,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }
}
