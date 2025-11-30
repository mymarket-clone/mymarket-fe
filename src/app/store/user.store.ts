import { Injectable, signal } from '@angular/core'
import { User } from '../types/User'

@Injectable({ providedIn: 'root' })
export class UserStore {
  private user = signal<User | null>(null)

  public constructor() {
    const stored = window.localStorage.getItem('user')
    if (stored) this.user.set(JSON.parse(stored))
  }

  public setUser(user: User | null): void {
    this.user.set(user)
    window.localStorage.setItem('user', JSON.stringify(user))
  }

  public getUser(): User | null {
    return this.user()
  }

  public logout(): void {
    this.user.set(null)
    window.localStorage.removeItem('user')
  }
}
