import { Routes } from '@angular/router'
import { Login } from './views/auth/login/login'
import { Main } from './layouts/main/main'
import { Auth } from './layouts/auth/auth'
import { RecoverPassword } from './views/auth/recover-password/recover-password'

export const routes: Routes = [
  {
    path: '',
    component: Main,
  },
  {
    path: 'user',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: 'recover-password', component: RecoverPassword },
    ],
  },
]
