import { InjectionToken } from '@angular/core'
import { IPostDetails } from '@app/interfaces/response/IPostDetails'

export const POST_DATA = new InjectionToken<{ post: IPostDetails }>('POST_DATA')
