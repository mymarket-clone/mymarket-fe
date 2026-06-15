import { Injectable, signal } from '@angular/core'
import { User } from '@app/types/User'

@Injectable({ providedIn: 'root' })
export class UserStore {
  private user = signal<User | null>(null)

  public constructor() {
    const stored = window.localStorage.getItem('user')
    if (stored) this.user.set(this.normalizeUser(JSON.parse(stored)))
  }

  public setUser(user: User | null): void {
    const normalizedUser = this.normalizeUser(user)

    this.user.set(normalizedUser)

    if (normalizedUser) window.localStorage.setItem('user', JSON.stringify(normalizedUser))
    else window.localStorage.removeItem('user')
  }

  public getUser(): User | null {
    return this.user()
  }

  public setFavoritesBase(number: number): void {
    this.user.update((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        user: {
          ...prev.user,
          favoritesCount: number,
        },
      }
    })
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

  public setBalance(balance: number): void {
    this.user.update((prev) => {
      if (!prev) return prev

      const next = {
        ...prev,
        user: {
          ...prev.user,
          balance,
        },
      }

      window.localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }

  public getBalance(): number {
    return this.user()?.user.balance ?? 0
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
    if (!u) return null

    return [u.firstname || u.name, u.lastname].filter(Boolean).join(' ') || null
  }

  public getFirstName(): string | null {
    const u = this.user()?.user
    return u ? u.firstname || u.name || null : null
  }

  public logout(): void {
    window.location.href = '/'
    window.localStorage.removeItem('user')
    this.user.set(null)
  }

  private normalizeUser(user: User | null): User | null {
    if (!user?.user) return user

    const detail = user.user
    const firstName = detail.firstname || detail.name || ''

    return {
      ...user,
      user: {
        ...detail,
        firstname: firstName,
        name: detail.name || firstName,
        lastname: detail.lastname || '',
        balance: Number(detail.balance ?? 0),
      },
    }
  }
}
