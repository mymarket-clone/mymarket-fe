import { Routes } from '@angular/router'
import { Main } from './layouts/main/main'
import { Auth } from './layouts/auth/auth'
import { Login } from './views/auth/login/login'
import { PasswordRecovery } from './views/auth/password-recovery/password-recovery'
import { Register } from './views/auth/register/register'

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
      { path: 'register', component: Register },
      { path: 'recover-password', component: PasswordRecovery },
    ],
  },
]
