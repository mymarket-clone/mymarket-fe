import { Component, signal } from '@angular/core'
import { ApiService } from '../../../services/http/api.service'
import { UserStore } from '../../../stores/user.store'
import { Router, RouterLink } from '@angular/router'
import { FormService } from '../../../services/form.service'
import { ILoginForm } from '../../../interfaces/forms/ILoginForm'
import { NgTemplateOutlet } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'
import { Zod } from '../../../utils/Zod'
import { HttpStatus } from '../../../types/enums/HttpStatus'
import { Button } from '../../../components/button/button'
import { InjectElementDirective } from '../../../modules/directives/injectElement.directive'
import { Input } from '../../../components/input/input'
import { HttpErrorCodes } from '../../../types/enums/HttpErrorCodes'
import { TranslocoDirective } from '@jsverse/transloco'
import { User } from '../../../types/User'
import { IHttpService } from '../../../interfaces/common/IHttpService'
import { HttpMethod } from '../../../types/enums/HttpMethod'

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
    TranslocoDirective,
  ],
  providers: [FormService],
  templateUrl: './login.html',
})
export class Login {
  public showSites = signal<boolean>(false)
  public loginState?: IHttpService<User>

  public constructor(
    private readonly apiService: ApiService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    private readonly zod: Zod,
    public readonly loginFs: FormService<ILoginForm>
  ) {
    this.loginFs.setForm(
      new FormGroup({
        emailOrPhone: new FormControl('', this.zod.required()),
        password: new FormControl('', this.zod.required()),
      })
    )
  }

  public toggleSites(): void {
    this.showSites.set(!this.showSites())
  }

  public onSubmit(): void {
    this.loginFs.submit({
      onSuccess: () => {
        this.loginState = this.apiService.request({
          method: HttpMethod.POST,
          endpoint: 'auth/login-user',
          body: this.loginFs.getValues(),
          form: this.loginFs.form,
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
      },
    })
  }
}
