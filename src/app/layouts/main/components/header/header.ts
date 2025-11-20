import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { UserStore } from '../../../../store/user.store'

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public constructor(public readonly userStore: UserStore) {}

  public get userJson(): string {
    return JSON.stringify(this.userStore.getUser(), null, 2) ?? 'No user'
  }
}
