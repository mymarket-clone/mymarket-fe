import { Component } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { UserStore } from '../../../../store/user.store'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-header',
  imports: [RouterLink, SvgIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
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
    if (this.userStore.getUser()) {
      this.userStore.logout()
    } else {
      this.router.navigate(['/user/login'])
    }
  }
}
