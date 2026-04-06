import { NgTemplateOutlet } from '@angular/common'
import { Component, signal } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { RouterLink, Router } from '@angular/router'
import { Button } from '@app/components/button/button'
import { Input } from '@app/components/input/input'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { ILoginForm } from '@app/interfaces/forms/ILoginForm'
import { InjectElementDirective } from '@app/modules/directives/injectElement.directive'
import { FormService } from '@app/services/form.service'
import { ApiService } from '@app/services/http/api.service'
import { UserStore } from '@app/stores/user.store'
import { HttpErrorCodes } from '@app/types/enums/HttpErrorCodes'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { HttpStatus } from '@app/types/enums/HttpStatus'
import { User } from '@app/types/User'
import { Zod } from '@app/utils/Zod'
import { TranslocoDirective } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

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
