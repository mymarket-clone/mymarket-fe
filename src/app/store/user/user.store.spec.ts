import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserStore } from './user.store'
import { User } from '../../types/User'

describe('UserStore', () => {
  let service: UserStore

  const mockUser: User = {
    data: {
      accessToken: 'mockAccessToken123',
      refreshToken: 'mockRefreshToken456',
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      user: {
        id: 1,
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        emailVerified: true,
      },
    },
  }

  beforeEach(() => {
    service = new UserStore()
    service.setUser(mockUser)

    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
        setItem: vi.fn(),
        getItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
  })

  it('should get and set user', () => {
    expect(service.getUser()).toEqual(mockUser)
  })

  it('should clear the user and remove from localStorage', () => {
    service.logout()
    expect(service.getUser()).toBeNull()
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('user')
  })
})
