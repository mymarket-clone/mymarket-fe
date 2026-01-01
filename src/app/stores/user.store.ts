import { Injectable, signal } from '@angular/core'
import { ILoginUser } from '../interfaces/response/ILoginUser'

@Injectable({ providedIn: 'root' })
export class UserStore {
  private user = signal<ILoginUser | null>(null)

  public constructor() {
    const stored = window.localStorage.getItem('user')
    if (stored) this.user.set(JSON.parse(stored))
  }

  public setUser(user: ILoginUser | null): void {
    this.user.set(user)
    window.localStorage.setItem('user', JSON.stringify(user))
  }

  public getUser(): ILoginUser | null {
    return this.user()
  }

  public logout(): void {
    this.user.set(null)
    window.localStorage.removeItem('user')
  }
}
