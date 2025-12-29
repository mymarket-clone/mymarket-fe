import { Component, signal } from '@angular/core'
import { AuthService } from '../../../services/auth.service'
import { UserStore } from '../../../store/user.store'
import { Router, RouterLink } from '@angular/router'
import { FormService } from '../../../services/form.service'
import { ILoginForm } from '../../../interfaces/forms/ILoginForm'
import { NgTemplateOutlet } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'
import { Zod } from '../../../utils/Zod'
import { HttpStatus } from '../../../types/enums/HttpStatus'
import { Button } from '../../../components/button/button'
import { InjectElementDirective } from '../../../directives/injectElement.directive'
import { Input } from '../../../components/input/input'
import { HttpErrorCodes } from '../../../types/enums/HttpErrorCodes'

@Component({
  selector: 'app-login',
  imports: [
    Input,
    SvgIconComponent,
    ReactiveFormsModule,
    RouterLink,
    InjectElementDirective,
    NgTemplateOutlet,
    Button,
  ],
  providers: [FormService],
  templateUrl: './login.html',
})
export class Login {
  public showSites = signal<boolean>(false)
  public loginState?: ReturnType<AuthService['loginUser']>

  public constructor(
    private readonly authService: AuthService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    public readonly loginFs: FormService<ILoginForm>
  ) {
    this.loginFs.setForm(
      new FormGroup({
        emailOrPhone: new FormControl('', Zod.required()),
        password: new FormControl('', Zod.required()),
      })
    )
  }

  public toggleSites(): void {
    this.showSites.set(!this.showSites())
  }

  public onSubmit(): void {
    this.loginFs.submit(() => {
      this.loginState = this.authService.loginUser({
        body: this.loginFs.getValues(),
        onSuccess: (response) => {
          this.userStore.setUser(response)
          this.router.navigate(['/'])
        },
        onError: (_, record) => {
          if (
            record &&
            record.status == HttpStatus.Unauthorized &&
            record.code == HttpErrorCodes.EmailNotVerified
          ) {
            this.router.navigate(['/user/register'], {
              queryParams: { email: record.email },
            })
          }
        },
      })
    })
  }
}
