import { Injectable, signal } from '@angular/core'
import { User } from '@app/types/User'

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

  public setFavorites(delta: number): void {
    this.user.update((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        user: {
          ...prev.user,
          favoritesCount: (prev.user.favoritesCount ?? 0) + delta,
        },
      }
    })
  }

  public getFavorites(): number {
    return this.user()?.user.favoritesCount ?? 0
  }

  public get accessToken(): string | null {
    return this.user()?.accessToken ?? null
  }

  public get refreshToken(): string | null {
    return this.user()?.refreshToken ?? null
  }

  public getUserId(): number | null {
    return this.user()?.user.id ?? null
  }

  public getUserName(): string | null {
    const u = this.user()?.user
    return u ? `${u.name} ${u.lastname}` : null
  }

  public logout(): void {
    window.location.href = '/'
    window.localStorage.removeItem('user')
    this.user.set(null)
  }
}
