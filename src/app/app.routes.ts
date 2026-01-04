import { Routes } from '@angular/router'
import { MainLayout } from './layouts/main/main'
import { Auth } from './layouts/auth/auth'
import { Login } from './views/auth/login/login'
import { PasswordRecovery } from './views/auth/password-recovery/password-recovery'
import { Register } from './views/auth/register/register'
import { Menu } from './views/main/menu'
import { AddPost } from './views/main/menu/addPost/addPost'

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'menu',
        component: Menu,
        children: [
          {
            path: '',
            redirectTo: 'add-post',
            pathMatch: 'full',
          },
          {
            path: 'add-post',
            component: AddPost,
          },
        ],
      },
    ],
  },
  {
    path: 'user',
    component: Auth,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'recover-password', component: PasswordRecovery },
    ],
  },
]
