import { Injectable } from '@angular/core'
import { UserStore } from '@app/stores/user.store'
import { User } from '@app/types/User'

type GoogleCallbackMessage = {
  source: 'google-oauth'
  auth?: string
  error?: string
  message?: string
}

const API_ORIGIN = 'http://localhost:5281'

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  public constructor(private readonly userStore: UserStore) {}

  public async signIn(returnUrl: string): Promise<User> {
    const redirectUri = `${window.location.origin}/user/google-callback`
    const user = await this.openPopup(redirectUri)

    this.userStore.setUser(user)
    window.sessionStorage.setItem('googleLoginReturnUrl', returnUrl)
    return user
  }

  private openPopup(redirectUri: string): Promise<User> {
    const popup = window.open(
      `${API_ORIGIN}/api/auth/google/client/start?returnUrl=${encodeURIComponent(redirectUri)}`,
      'google-login',
      'width=500,height=650'
    )

    if (!popup) throw new Error('Google popup was blocked.')

    return new Promise<User>((resolve, reject) => {
      const timer = window.setInterval(() => {
        if (popup.closed) {
          cleanup()
          reject(new Error('Google sign-in was cancelled.'))
        }
      }, 500)

      const cleanup = (): void => {
        window.clearInterval(timer)
        window.removeEventListener('message', onMessage)
      }

      const onMessage = (event: MessageEvent<GoogleCallbackMessage>): void => {
        if (event.origin !== window.location.origin || event.data?.source !== 'google-oauth') return

        cleanup()
        popup.close()

        if (event.data.error) {
          reject(new Error(event.data.message || event.data.error))
          return
        }

        if (!event.data.auth) {
          reject(new Error('Invalid Google response.'))
          return
        }

        resolve(this.decodeAuth(event.data.auth))
      }

      window.addEventListener('message', onMessage)
    })
  }

  private decodeAuth(payload: string): User {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    return JSON.parse(atob(padded)) as User
  }
}
