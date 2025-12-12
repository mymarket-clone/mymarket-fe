import { Component, signal } from '@angular/core'
import { Input } from '../../../components/input/input'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Button } from '../../../components/button/button'
import { AuthService } from '../../../services/auth.service'
import { LoginForm } from '../../../types/forms/LoginForm'
import { FormService } from '../../../services/form-service/form.service'
import { LoginCredentials } from '../../../interfaces/payload/LoginCredentials'
import { UserStore } from '../../../store/user/user.store'
import { TooltipDirective } from '../../../directives/appTooltip'
import { HttpStatus } from '../../../types/enums/HttpStatus'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-login',
  imports: [Input, ReactiveFormsModule, RouterLink, Button, TooltipDirective, SvgIconComponent],
  providers: [FormService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../../../shared/styles/auth-modal.scss'],
})
export class Login {
  public loginState?: ReturnType<AuthService['loginUser']>
  public abbrState = signal<boolean>(false)

  public constructor(
    private readonly authService: AuthService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    public readonly fs: FormService<LoginForm>
  ) {
    this.fs.setForm(
      new FormGroup({
        emailOrPhone: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      })
    )
  }

  public onSubmit(): void {
    this.fs.setSubmitted()

    if (this.fs.form.valid) {
      this.loginState = this.authService.loginUser({
        body: this.fs.form.getRawValue() as LoginCredentials,
        form: this.fs.form,
        onSuccess: (response) => {
          this.userStore.setUser(response)
          this.router.navigate(['/'])
        },
        onError: (_, record) => {
          if (record?.status == HttpStatus.Unauthorized && record?.email) {
            this.router.navigate(['/user/register'], {
              queryParams: { email: record.email },
            })
          }
        },
      })
    }
  }
}
