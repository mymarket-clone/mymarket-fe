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
import { Users } from './views/users/users'
import { MyFavorites } from './views/main/menu/my-favorites/my-favorites'
import { MyListing } from './views/main/menu/my-listing/my-listing'
import { EditAccount } from './views/main/menu/edit-account/edit-account'

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
        canActivate: [loggedGuard],
        data: { requiresAuth: true },
        children: [
          {
            path: '',
            redirectTo: 'add-advertisement',
            pathMatch: 'full',
          },
          {
            path: 'add-advertisement',
            component: AddAdvertisement,
          },
          {
            path: 'my-listing',
            component: MyListing,
          },
          {
            path: 'my-favorites',
            component: MyFavorites,
          },
          {
            path: 'edit-account',
            component: EditAccount,
          },
        ],
      },
      {
        path: `post/:id`,
        component: Post,
      },
      {
        path: `users/:id`,
        component: Users,
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
