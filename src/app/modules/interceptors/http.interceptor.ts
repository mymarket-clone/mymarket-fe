import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, throwError } from 'rxjs'
import { catchError, filter, mergeMap, take } from 'rxjs/operators'
import { ApiService } from '../../services/http/api.service'
import { UserStore } from '../../stores/user.store'

let isRefreshing = false
const refreshTokenSubject = new BehaviorSubject<string | null>(null)

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const apiService = inject(ApiService)
  const userStore = inject(UserStore)

  const currentUser = userStore.getUser()
  const accessToken = currentUser?.accessToken
  const authReq = accessToken ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }) : req

  if (req.url.includes('/refresh')) return next(authReq)

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err)

      const user = userStore.getUser()
      if (!user?.refreshToken) {
        userStore.logout()
        router.navigate(['/'])
        return throwError(() => err)
      }

      if (!isRefreshing) {
        isRefreshing = true
        refreshTokenSubject.next(null)

        return apiService
          .refreshUser({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          })
          .pipe(
            mergeMap((loginUser) => {
              isRefreshing = false
              userStore.setUser(loginUser)
              refreshTokenSubject.next(loginUser.accessToken)
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${loginUser.accessToken}` } }))
            }),
            catchError((refreshErr) => {
              isRefreshing = false
              refreshTokenSubject.next(null)
              userStore.logout()
              router.navigate(['/'])
              return throwError(() => refreshErr)
            })
          )
      } else {
        return refreshTokenSubject.pipe(
          filter((token): token is string => token !== null),
          take(1),
          mergeMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
        )
      }
    })
  )
}
