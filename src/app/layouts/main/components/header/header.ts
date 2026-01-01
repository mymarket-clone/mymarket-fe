import { Component } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { Router } from '@angular/router'
import { UserStore } from '../../../../stores/user.store'

@Component({
  selector: 'app-header',
  imports: [SvgIconComponent],
  templateUrl: './header.html',
})
export class Header {
  public constructor(
    public readonly userStore: UserStore,
    private readonly router: Router
  ) {}

  public get userJson(): string {
    return JSON.stringify(this.userStore.getUser(), null, 2) ?? 'No user'
  }

  public handleLoginButton(): void {
    if (this.userStore.getUser()) this.userStore.logout()
    else this.router.navigate(['/user/login'])
  }
}
