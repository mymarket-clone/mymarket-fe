import { ISendEmailVerificationPayload } from '../payload/IEmailVerificationPayload'
import { ILoginPayload } from '../payload/ILoginPayload'
import { IPasswordRecoveryPayload } from '../payload/IPasswordRecoveryPayload'
import { IRegisterPayload } from '../payload/IRegisterPayload'
import { ISendPasswordRecoveryPayload } from '../payload/ISendPasswordRecoveryPayload'
import { IVerifyPasswordCodePayload } from '../payload/IVerifyPasswordCodePayload'
import { ICategoryNode } from '../response/ICategoryNode'
import { ILoginUser } from '../response/ILoginUser'
import { IHttpService } from './IHttpService'
import { IServiceRequest } from './IServiceRequest'

export interface IApiService {
  loginUser: (options: IServiceRequest<ILoginPayload, ILoginUser>) => IHttpService<ILoginUser>
  registerUser: (options: IServiceRequest<IRegisterPayload, void>) => IHttpService<void>
  sendEmailVerificationCode: (
    options: IServiceRequest<ISendEmailVerificationPayload, void>
  ) => IHttpService<void>
  verifyEmailCode: (
    options: IServiceRequest<IVerifyPasswordCodePayload, ILoginUser>
  ) => IHttpService<ILoginUser>
  verifyPasswordCode: (options: IServiceRequest<IVerifyPasswordCodePayload, void>) => IHttpService<void>
  sendPasswordRecovery: (options: IServiceRequest<ISendPasswordRecoveryPayload, void>) => IHttpService<void>
  passwordRecovery: (options: IServiceRequest<IPasswordRecoveryPayload, void>) => IHttpService<void>
  getCategories: (options: IServiceRequest<void, ICategoryNode[]>) => IHttpService<ICategoryNode[]>
}
