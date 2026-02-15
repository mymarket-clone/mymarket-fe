import { User } from '../../types/User'
import { IAddPostPayload } from '../payload/IAddPostPayload'
import { ISendEmailVerificationPayload } from '../payload/IEmailVerificationPayload'
import { IGetCategoriesFlatPayload } from '../payload/IGetCategoriesFlatPayload'
import { ILoginPayload } from '../payload/ILoginPayload'
import { IPasswordRecoveryPayload } from '../payload/IPasswordRecoveryPayload'
import { IRegisterPayload } from '../payload/IRegisterPayload'
import { ISendPasswordRecoveryPayload } from '../payload/ISendPasswordRecoveryPayload'
import { IVerifyPasswordCodePayload } from '../payload/IVerifyPasswordCodePayload'
import { ICategoryNode } from '../response/ICategoryNode'
import { ICity } from '../response/ICity'
import { IHttpService } from './IHttpService'
import { IServiceRequest } from './IServiceRequest'

export interface IApiService {
  loginUser: (options: IServiceRequest<ILoginPayload, User>) => IHttpService<User>
  registerUser: (options: IServiceRequest<IRegisterPayload, void>) => IHttpService<void>
  sendEmailVerificationCode: (
    options: IServiceRequest<ISendEmailVerificationPayload, void>
  ) => IHttpService<void>
  verifyEmailCode: (options: IServiceRequest<IVerifyPasswordCodePayload, User>) => IHttpService<User>
  verifyPasswordCode: (options: IServiceRequest<IVerifyPasswordCodePayload, void>) => IHttpService<void>
  sendPasswordRecovery: (options: IServiceRequest<ISendPasswordRecoveryPayload, void>) => IHttpService<void>
  passwordRecovery: (options: IServiceRequest<IPasswordRecoveryPayload, void>) => IHttpService<void>
  getCategoriesFlat: (
    options?: IServiceRequest<IGetCategoriesFlatPayload, ICategoryNode[]>
  ) => IHttpService<ICategoryNode[]>
  addPost: (options?: IServiceRequest<IAddPostPayload, unknown>) => IHttpService<unknown>
  getAllCities: (options?: IServiceRequest<void, ICity[]>) => IHttpService<ICity[]>
}
