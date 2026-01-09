import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { UserStore } from '../../stores/user.store'

export const loggedGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore)
  const router = inject(Router)

  const requiresAuth = route.data?.['requiresAuth'] !== false
  const user = userStore.getUser()

  if (!requiresAuth) {
    return user ? router.createUrlTree(['/']) : true
  }

  return user
    ? true
    : router.createUrlTree(['/user/login'], {
        queryParams: { returnUrl: state.url },
      })
}
