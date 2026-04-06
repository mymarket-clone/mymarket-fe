import { Routes } from '@angular/router'
import { Auth } from './layouts/auth/auth'
import { MainLayout } from './layouts/main/main'
import { loggedGuard } from './modules/guards/logged.guard'
import { Login } from './views/auth/login/login'
import { PasswordRecovery } from './views/auth/password-recovery/password-recovery'
import { Register } from './views/auth/register/register'
import { HomeComponent } from './views/main/home/home'
import { AddAdvertisement } from './views/main/menu/add-advertisement/add-advertisement'
import { Menu } from './views/main/menu/menu'
import { Post } from './views/post/post'
import { Search } from './views/search/search'

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'search',
        component: Search,
      },
      {
        path: 'menu',
        component: Menu,
        children: [
          {
            path: '',
            redirectTo: 'add-advertisement',
            pathMatch: 'full',
          },
          {
            path: 'add-advertisement',
            component: AddAdvertisement,
            canActivate: [loggedGuard],
            data: { requiresAuth: true },
          },
          {
            path: 'my-listing',
            component: AddAdvertisement,
            canActivate: [loggedGuard],
            data: { requiresAuth: true },
          },
        ],
      },
      {
        path: `post/:id`,
        component: Post,
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
    canActivate: [loggedGuard],
    data: { requiresAuth: false },
  },
]
